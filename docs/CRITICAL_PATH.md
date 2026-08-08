# Critical Path

## Implemented sequence

1. Operator authenticates with the configured bearer token.
2. Operator explicitly connects Google Calendar through OAuth consent.
3. Operator creates a draft schedule with timezone, calendar, durations, availability windows, buffers, notice, horizon, and reminders.
4. Activation verifies the target calendar through Google before the public page becomes available.
5. Requester opens `/book/{slug}`, chooses duration/date, and receives slots generated chronologically from policy minus live Google busy intervals.
6. Requester enters name/email and explicitly confirms the reviewed summary.
7. Server validates the policy again, starts a write lock, checks all local schedules sharing the same owner/calendar for overlap, then checks Google events again.
8. A deterministic Google event ID is created from the schedule and idempotency key. A retry either returns the existing booking or resolves the same Google event.
9. Google sends attendee updates and configured email reminders.
10. The requester uses a fragment-based manage link. Reschedule rechecks local and Google conflicts and uses the Google event ETag. Cancel deletes the event with attendee updates; a Google 404 is treated as already absent and recorded locally.

## Invariants

- No active public schedule without successful Google calendar verification.
- No booking outside policy windows or accepted durations.
- No silent DST coercion for nonexistent/ambiguous wall times.
- No overlapping pending/confirmed local booking across schedules sharing the same calendar.
- No success response before Google mutation completes or an idempotent existing event is resolved.
- No provider fallback in production. The fake provider exists under `test/` only.

## Smoke-test evidence

`test/booking-service.test.js` executes create → activate → slot search → book → idempotent retry → competing overlap rejection → reschedule → cancel. `test/policy.test.js` covers Amsterdam DST gap/fold behavior. Live Google execution is blocked pending operator credentials and consent.
