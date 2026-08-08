'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Temporal } = require('@js-temporal/polyfill');
const { generateCandidateSlots, validateScheduleInput } = require('../src/policy');

function schedule(availability) {
  return { durations:[30],timezone:'Europe/Amsterdam',weeklyAvailability:availability,slot_interval_minutes:30,buffer_before_minutes:0,buffer_after_minutes:0,min_notice_minutes:0,max_advance_days:730 };
}

test('validates schedule invariants and sorts durations', () => {
  const result = validateScheduleInput({ name:'Test',timezone:'Europe/Amsterdam',calendarId:'primary',durations:[60,30,30],weeklyAvailability:{1:[['09:00','17:00']]}});
  assert.deepEqual(result.durations,[30,60]);
});

test('generates chronological slots with busy intervals removed', () => {
  const day='2026-08-10';
  const result=generateCandidateSlots(schedule({1:[['09:00','11:00']]}),30,day,day,[{start:'2026-08-10T07:30:00Z',end:'2026-08-10T08:00:00Z'}],Temporal.Instant.from('2026-08-01T00:00:00Z'));
  assert.deepEqual(result.map((slot)=>slot.start),['2026-08-10T07:00:00Z','2026-08-10T08:00:00Z','2026-08-10T08:30:00Z']);
});

test('skips a DST-gap window instead of silently shifting it', () => {
  const day='2026-03-29';
  const result=generateCandidateSlots(schedule({7:[['02:30','03:30']]}),30,day,day,[],Temporal.Instant.from('2026-03-01T00:00:00Z'));
  assert.deepEqual(result,[]);
});

test('skips an ambiguous DST-fold start instead of choosing silently', () => {
  const day='2026-10-25';
  const result=generateCandidateSlots(schedule({7:[['02:30','03:30']]}),30,day,day,[],Temporal.Instant.from('2026-10-01T00:00:00Z'));
  assert.deepEqual(result,[]);
});
