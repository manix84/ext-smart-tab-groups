# Contributing

Thank you for helping improve Smart Tab Groups.

## Before starting

For substantial work, open an issue first so the intended behaviour can be agreed. Keep changes focused and explain user-visible trade-offs. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local checks

Install dependencies with `npm install`, then run:

```sh
npm run check
```

Changes to grouping behaviour should include tests. Changes that affect browser integration should be verified in Firefox and, where supported, Chrome.

## Commit requirements

Every commit must:

1. update `WHATSNEW.md` with a new version describing the delta from the preceding commit;
2. keep the matching versions in `package.json` and `public/manifest.json` in sync;
3. pass the complete local check suite;
4. avoid drive-by formatting or unrelated changes.

## Pull requests

Explain the problem, the user-visible result, testing performed, privacy or permission implications, and browser compatibility. Small, reviewable pull requests are preferred.
