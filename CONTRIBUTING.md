# Contributing to react-interactive-ascii

How to propose changes, run checks locally, and open pull requests.

## License

This project uses the [MIT License](./LICENSE). By contributing, you agree
your contributions are licensed under the same terms. The MIT License includes
an implicit copyright and software grant, so you do not need to sign a separate
CLA, the license itself grants the project the rights it needs to incorporate,
modify, and distribute your work.

## Where to discuss

- **Issues, bugs, feature ideas:** open a
  [GitHub issue](https://github.com/sanguine59/react-interactive-ascii/issues).

## What to work on

Issues labelled `good first issue` are open invitations, those PRs will be
reviewed and merged faster than drive-by refactors. If you want to attempt
something larger, open an issue first so we can agree on the shape of it
before you spend time on code.

## Development setup

1. Clone the repository.
2. `npm install` to install dependencies.
3. `npm run build` to compile and package.

## Branch and pull requests

- Branch off `main`. Keep branches short-lived.
- **PR titles follow the conventional-commit format** (see below). The
  convention is what release notes will be generated from once a release
  pipeline lands, so it's worth following from day one even though no
  automation enforces it yet.
- **PR description:** what changed, why, how to verify (commands), and any
  risk or rollback notes.
- Keep diffs focused. One concern per PR makes review fast.

### Pull request titles

Format: `<type>[(scope)][!]: <subject>`

| Type               | Meaning                                                |
| ------------------ | ------------------------------------------------------ |
| `feat`             | New user-facing feature                                |
| `fix`              | Bug fix                                                |
| `perf`             | Performance improvement with no behavior change        |
| `refactor`         | Internal change, no behavior change                    |
| `test`             | Add or fix tests                                       |
| `ci`               | CI/workflow change                                     |
| `build` / `deps`   | Build system or dependency update                      |
| `docs`             | Documentation only                                     |
| `chore` / `revert` | Tooling, version bumps, reverts (excluded from notes)  |

Append `!` to the type or include `BREAKING CHANGE:` in the body to flag a
breaking change. Examples:

```text
feat(component): accept a custom character ramp
fix(canvas): stop the render loop on unmount
perf(render): reuse the offscreen buffer between frames
docs: document the density prop
chore(deps): bump rollup to v4.63
build(rollup): emit a cjs bundle alongside esm
feat(component)!: rename the `chars` prop to `ramp`
```

Commits within a PR may use any style, only the **merged PR title** is the
authoritative entry, so that's the one the convention applies to.

## Before you open a PR

Run the build and make sure it's clean:

```bash
npm install
npm run build
```

`npm run build` runs `tsc` and then Rollup, so a type error fails the build.
There is no test or lint script yet, the build is the only automated gate.

Then check by hand:

- [ ] `dist/` compiles and the generated `dist/index.d.ts` still describes the
      public API you intended.
- [ ] If you changed the component's props or behaviour, you rendered it in a
      React 18+ app and confirmed it still works (the canvas fills its
      container, pointer interaction responds, no console warnings).
- [ ] No build artifacts committed. `dist/` and `*.tgz` are outputs, not source.
- [ ] Only files relevant to your change are in the diff, no stray formatting
      churn or editor config.
- [ ] Your PR title follows the format above, and the description says what
      changed, why, and how to verify it.

## What happens after you open a PR

The maintainer may request changes for correctness, tests, security, or
consistency with existing patterns. Push follow-up commits to the same branch,
there's no need to force-push or open a replacement PR. Once it's approved the
maintainer merges it, and your PR title becomes the release-note entry.

## AI-assisted contributions

Coding agents are welcome to send PRs. Please:

- Follow any project context files you find (e.g. `CLAUDE.md`, `AGENTS.md`)
  if they exist.
- Avoid drive-by refactors unrelated to the issue you're solving.
- Prefer incremental, test-backed changes, a small change with a test beats
  a large change without one.