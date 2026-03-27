# Publish This Project

## What this project is

- Static React + TypeScript + Vite app
- No backend
- No environment variables required
- Deploy with GitHub Pages

## Before you upload

Double-check this file:

- `vite.config.ts`

Make sure it includes:

```ts
base: "./",
```

## GitHub Desktop steps

1. Open GitHub Desktop.
2. Click `File` > `Add local repository...`
3. Choose this folder:

```text
C:\Users\jezzb\Downloads\Tinder for dog adoption\soidog_codex_export_bundle\Version 1.0.0
```

4. If GitHub Desktop says this is not a Git repository, click `Create a Repository`.
5. Use these values:
   - Name: your repo name
   - Local path: keep this folder
   - Initialize with README: leave off
   - Git ignore: leave as-is because this project already has one
   - License: optional
6. Click `Create Repository`.
7. Review the changed files.
8. Add a commit message like:

```text
Prepare Soi Dog Game for GitHub Pages deployment
```

9. Click `Commit to main`.
10. Click `Publish repository`.
11. Choose whether the repo is public or private.
12. Click `Publish Repository`.

## GitHub Pages steps

1. Open the repository on GitHub in your browser.
2. Click `Settings`.
3. Click `Pages`.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.
5. Click `Actions`.
6. Open the workflow called `Deploy to GitHub Pages`.
7. Wait until it finishes successfully.
8. Go back to `Settings` > `Pages`.
9. Open the site URL shown there.

## Expected live URL

Usually:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/
```

## Environment variables

None required.

## Final check after deploy

1. Open the live URL.
2. Confirm the language picker loads.
3. Confirm the Thai and UK flag cards display correctly.
4. Complete one full quiz run.
5. Click the result CTA link.
