## 2024-05-24 - CI Workload Identity Issue
**Learning:** We need to conditionally execute actions that depend on API keys (like google-github-actions/run-gemini-cli) to prevent workflow failures when the secrets are absent.
**Action:** Always check the CI configuration.
