# Contributing

Short guide for working from a **fork** and staying aligned with the maintainer’s repo.

## Remotes

| Remote    | What it is |
|-----------|------------|
| `origin`  | Your fork (e.g. `theanimatedmonk/shuffled` — where you `git push`). |
| `upstream`| The maintainer’s repo (e.g. `bhnvgoyal12-coder/shuffled` — source of truth for latest code). |

After cloning your fork, `upstream` should exist. If you need to add or fix it:

```bash
git remote add upstream https://github.com/bhnvgoyal12-coder/shuffled.git
# or: git remote set-url upstream https://github.com/bhnvgoyal12-coder/shuffled.git
git remote -v
```

## Pull latest changes from the maintainer (do this often)

Before starting new work or updating a long-lived branch:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

- **`git fetch upstream`** — downloads the maintainer’s latest commits without changing your files yet.
- **`git merge upstream/main`** — brings those commits into your local `main`.

Prefer **rebase** instead of merge if your team agrees (linear history):

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main
```

## Typical contribution flow

1. Sync `main` with `upstream` (commands above).
2. Create a branch from `main`:

   ```bash
   git checkout -b feature/short-description
   ```

   Good prefixes: `feature/`, `fix/`, `docs/` — lowercase, hyphens.

3. Make changes, then commit:

   ```bash
   git add .
   git commit -m "Clear sentence describing why this change exists"
   ```

4. Push your branch to **your fork**:

   ```bash
   git push -u origin feature/short-description
   ```

5. On GitHub: open a **Pull Request** from your fork → maintainer’s repo.

6. Code review; push more commits to the same branch if asked; when merged, delete the branch and sync `main` again.

## Pull requests

- Open the PR **from your fork** (`origin`) **into** the maintainer’s default branch (usually `main`).
- Short description of what changed and why; link issues if any.

## Merge conflicts

They can happen even with few contributors. If GitHub shows conflicts, update your branch with the latest `main` (from `upstream` or `origin/main` after syncing), resolve locally, commit, and push.

## `.gitignore` and secrets

- Do not commit `.env` files with secrets. The repo ignores `.env` and `.env.*` except `.env.example` — use `.env.example` for non-secret variable names only.
