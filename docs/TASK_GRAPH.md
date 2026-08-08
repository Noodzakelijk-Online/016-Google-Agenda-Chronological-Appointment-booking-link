# Task Graph

```text
configuration + migration
          |
          v
operator auth -> Google OAuth/verify -> schedule activation
                                        |
availability policy + DST rules --------+
                    |
                    v
public slots -> review -> locked conflict recheck -> idempotent Google create
                                                   |
                                                   v
                      manage token -> reschedule / cancel

security + audit + rate limits + emergency stop apply across all API edges
tests -> build -> Docker/browser checks -> fresh-clone check -> release
```

The external dependency at the only incomplete acceptance edge is real Google OAuth consent and Calendar API access. It cannot be replaced by a fake result.
