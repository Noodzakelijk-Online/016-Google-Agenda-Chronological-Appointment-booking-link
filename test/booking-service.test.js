'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { defaultSchedule, futureDate, testRuntime } = require('./helpers');

test('critical path is idempotent, prevents overlap, reschedules, and cancels', async (t) => {
  const runtime=testRuntime(); t.after(()=>runtime.cleanup());
  const draft=runtime.service.createSchedule(defaultSchedule(),'request-create');
  const active=await runtime.service.setScheduleStatus(draft.id,'active','request-activate');
  const date=futureDate(10); const slots=await runtime.service.slots(active.slug,30,date,date); assert.ok(slots.length>2);
  const first=await runtime.service.book(active.slug,{name:'Ada Example',email:'ada@example.com',duration:30,start:slots[0].start},'idempotency-key-00000001','request-book');
  const replay=await runtime.service.book(active.slug,{name:'Ada Example',email:'ada@example.com',duration:30,start:slots[0].start},'idempotency-key-00000001','request-replay');
  assert.equal(first.id,replay.id); assert.equal(runtime.provider.created,1); assert.equal(first.status,'confirmed');
  await assert.rejects(()=>runtime.service.book(active.slug,{name:'Other User',email:'other@example.com',duration:30,start:slots[0].start},'idempotency-key-00000002','request-conflict'),(error)=>error.code==='SLOT_UNAVAILABLE');
  const url=new URL(first.manageUrl); const token=new URLSearchParams(url.hash.slice(1)).get('token');
  const rescheduled=await runtime.service.reschedule(first.id,token,{start:slots[2].start},'request-reschedule'); assert.equal(rescheduled.start,slots[2].start);
  const cancelled=await runtime.service.cancel(first.id,token,'request-cancel'); assert.equal(cancelled.status,'cancelled');
  const repeatedCancel=await runtime.service.cancel(first.id,token,'request-cancel-again'); assert.equal(repeatedCancel.status,'cancelled');
  assert.ok(runtime.service.auditLog().some((entry)=>entry.action==='booking.confirmed'));
});

test('emergency stop fails closed for public slots and bookings', async (t) => {
  const runtime=testRuntime(); t.after(()=>runtime.cleanup()); const draft=runtime.service.createSchedule(defaultSchedule(),'create'); await runtime.service.setScheduleStatus(draft.id,'active','activate'); runtime.service.setEmergencyStop(true,'stop'); const date=futureDate(5);
  await assert.rejects(()=>runtime.service.slots(draft.slug,30,date,date),(error)=>error.code==='BOOKING_PAUSED');
});

test('manage tokens are required and invalid tokens disclose no booking', async (t) => {
  const runtime=testRuntime(); t.after(()=>runtime.cleanup()); const draft=runtime.service.createSchedule(defaultSchedule(),'create'); await runtime.service.setScheduleStatus(draft.id,'active','activate'); const date=futureDate(5); const [slot]=await runtime.service.slots(draft.slug,30,date,date); const booking=await runtime.service.book(draft.slug,{name:'Ada Example',email:'ada@example.com',duration:30,start:slot.start},'idempotency-key-00000003','book');
  assert.throws(()=>runtime.service.managedBooking(booking.id,'wrong-token'),(error)=>error.code==='BOOKING_NOT_FOUND');
});

test('separate schedules sharing one calendar cannot overlap', async (t) => {
  const runtime=testRuntime(); t.after(()=>runtime.cleanup());
  const first=runtime.service.createSchedule(defaultSchedule(),'create-first');
  const second=runtime.service.createSchedule({...defaultSchedule(),name:'Second booking link'},'create-second');
  await runtime.service.setScheduleStatus(first.id,'active','activate-first');
  await runtime.service.setScheduleStatus(second.id,'active','activate-second');
  const date=futureDate(7);
  const [slot]=await runtime.service.slots(first.slug,30,date,date);
  await runtime.service.book(first.slug,{name:'Ada Example',email:'ada@example.com',duration:30,start:slot.start},'idempotency-key-calendar-01','book-first');
  await assert.rejects(
    ()=>runtime.service.book(second.slug,{name:'Grace Example',email:'grace@example.com',duration:30,start:slot.start},'idempotency-key-calendar-02','book-second'),
    (error)=>error.code==='SLOT_UNAVAILABLE'
  );
});

test('provider create failure rolls back pending local booking', async (t) => {
  const runtime=testRuntime(); t.after(()=>runtime.cleanup());
  const schedule=runtime.service.createSchedule(defaultSchedule(),'create');
  await runtime.service.setScheduleStatus(schedule.id,'active','activate');
  const date=futureDate(8);
  const [slot]=await runtime.service.slots(schedule.slug,30,date,date);
  runtime.provider.failCreate=true;
  await assert.rejects(
    ()=>runtime.service.book(schedule.slug,{name:'Ada Example',email:'ada@example.com',duration:30,start:slot.start},'idempotency-key-failure-01','book'),
    /provider unavailable/
  );
  assert.equal(runtime.service.listBookings().length,0);
});
