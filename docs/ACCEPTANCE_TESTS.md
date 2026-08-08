# Acceptance Tests

Status values are **PASS**, **BLOCKED**, or **NOT APPLICABLE**. A blocked live-provider check is never counted as a product pass.

| Journey or invariant | Automated evidence | Manual/live evidence | Status |
| --- | --- | --- | --- |
| Create and activate a schedule | `test/booking-service.test.js` | Activation UI will be browser-checked | PASS |
| Return timezone-correct slots in chronological order | `test/policy.test.js` | Requester UI will be browser-checked | PASS |
| Reject DST gap and fold ambiguity | `test/policy.test.js` | Europe/Amsterdam cases exercised | PASS |
| Book, retry idempotently, and create one event | `test/booking-service.test.js` | Fake provider only | PASS |
| Prevent overlap within and across schedule links on one calendar | `test/booking-service.test.js` | Fake provider only | PASS |
| Roll back when provider event creation fails | `test/booking-service.test.js` | Fake provider only | PASS |
| Manage link does not leak its token in HTTP requests | `test/booking-service.test.js`; fragment URL design | Browser URL fragment | PASS |
| Reschedule with a fresh conflict check | `test/booking-service.test.js` | Fake provider only | PASS |
| Cancel safely and tolerate an already-absent event | `test/booking-service.test.js` | Fake provider only | PASS |
| Emergency stop fails closed | `test/booking-service.test.js` | Admin UI will be browser-checked | PASS |
| Operator endpoints reject unauthenticated requests | `test/http.test.js` | Login UI will be browser-checked | PASS |
| Security headers and standard error envelope | `test/http.test.js` | Header inspection | PASS |
| Existing Chrome sorting extension remains functional | `test-content.js` | Chrome extension install not repeated in this run | PASS |
| Real Google OAuth consent and calendar verification | No fake can satisfy this | Requires operator Google credentials and consent | BLOCKED |
| Real create/reminder/reschedule/cancel delivery in Google Calendar | No fake can satisfy this | Requires the connected Google account | BLOCKED |
| SaaS billing, teams, AI decisions, upload/media, and workers | Outside this single-owner booking product | Deliberately not invented | NOT APPLICABLE |

## Live acceptance script

1. Configure HTTPS `BASE_URL`, `ADMIN_TOKEN`, `ENCRYPTION_KEY`, and Google OAuth credentials.
2. Run `npm run doctor`, start the server, open the admin UI, and connect Google.
3. Create and activate a schedule using a disposable calendar.
4. Book one slot from a private browser, confirm exactly one Google event and attendee email/reminders, then retry the same HTTP request and confirm no duplicate.
5. Attempt a competing booking, reschedule, cancel, confirm the event is updated then removed, export data, and remove the test data/calendar.
