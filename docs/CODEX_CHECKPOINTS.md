# Codex Checkpoints

## Current resume checkpoint

- Branch: `main`
- Starting commit: `c7c0d71`
- Product code and required documentation: implemented in the working tree
- Last verified baseline: check, 13 tests, extension tests, build, npm audit, Compose validation and browser QA passed; Docker image build is blocked by the stopped engine
- Release state: application commit `e5dca3e` is pushed and the fresh-clone smoke test passed; only live Google acceptance and Docker-engine execution remain external gates
- External block: real Google OAuth/Calendar acceptance requires operator credentials and consent

Resume by reading `docs/CRITICAL_PATH.md`, `docs/GOAL_COMPLETION_MATRIX.md`, and `docs/FINAL_VERIFICATION_REPORT.md`, then run `npm ci && npm run check && npm test && npm run build`.
