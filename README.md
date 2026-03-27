# Soi Dog Game

This project is a static frontend quiz app built with React, TypeScript, and Vite. It has no Python server, no Node backend, and no database. The browser loads a bundled single-page app plus static assets, so the right public deployment target is GitHub Pages rather than Render.

## Framework and runtime

- Framework: React 18
- Language: TypeScript
- Build tool / dev server: Vite 5
- Runtime in development: Node.js
- Runtime in production: static files served by GitHub Pages

Because this app is static-only, there is no server process to bind to `0.0.0.0`, no `PORT` handling, no `requirements.txt`, and no `Procfile`.

## Local development

Install dependencies and run the normal Vite dev server:

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1
```

## Build and checks

```bash
npm run lint
npm run test
npm run build
```

The production build is written to `dist/`.

## Deployment target

This repo is prepared for GitHub Pages with a GitHub Actions workflow:

- Workflow file: `.github/workflows/deploy-pages.yml`
- Build output: `dist/`
- Vite base path: relative (`./`) so assets load correctly on Pages

## Exact GitHub Pages steps

1. Create a new empty GitHub repository.
2. Push this project to the `main` branch.
3. In GitHub, open `Settings`.
4. Click `Pages` in the left sidebar.
5. Under `Build and deployment`, choose `Source: GitHub Actions`.
6. Go to the `Actions` tab.
7. Open the latest `Deploy to GitHub Pages` run and wait for it to finish.
8. After it succeeds, return to `Settings` > `Pages` and copy the public site URL.

## Exact git commands to publish to GitHub

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your real values.

```bash
cd "C:\Users\jezzb\Downloads\Tinder for dog adoption\soidog_codex_export_bundle\Version 1.0.0"
git init
git branch -M main
git add .
git commit -m "Prepare Soi Dog Game for GitHub Pages deployment"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

If this folder is already a git repo, use:

```bash
git add .
git commit -m "Prepare Soi Dog Game for GitHub Pages deployment"
git push
```

## Expected public URL

For a normal project repository, GitHub Pages will usually publish to:

`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`

If you publish from a user or organization site repository named `YOUR_GITHUB_USERNAME.github.io`, the URL will usually be:

`https://YOUR_GITHUB_USERNAME.github.io/`

## Secrets and env files

There are no required secrets for the current static app.

Do not commit these if you add them later:

- `.env`
- `.env.local`
- `.env.production`
- any `VITE_*` values that contain API keys or private endpoints

Important note: Vite environment variables prefixed with `VITE_` are exposed to the browser bundle. Do not put true secrets in them.

## Files changed for deployment

- `vite.config.ts`
  Added `base: "./"` so the built asset paths work cleanly on GitHub Pages project URLs.
- `vite.config.js`
  Kept the generated JavaScript config in sync with the TypeScript config.
- `.gitignore`
  Prevents `node_modules`, `dist`, local env files, extracted doc artifacts, and TypeScript build cache files from being committed.
- `.github/workflows/deploy-pages.yml`
  Builds the app on every push to `main` and deploys the `dist` folder to GitHub Pages.
- `README.md`
  Rewritten with exact framework detection, deployment guidance, GitHub commands, Pages settings, blockers, and a release checklist.

## Source structure

```text
src/
  components/
    ProgressHeader.tsx
    QuizCard.tsx
    ResultCard.tsx
  data/
    quizData.ts
  hooks/
    useSwipeGesture.ts
  lib/
    quizResults.ts
    quizResults.test.ts
  types/
    quiz.ts
  App.tsx
  main.tsx
  styles.css
public/
  favicon.svg
```

## Blockers

There are no code blockers for static deployment.

Potential operational blockers:

- the GitHub repository must exist before `git push`
- GitHub Pages must be set to `Source: GitHub Actions`
- the first deployment URL appears only after the workflow finishes successfully

## Final checklist

1. Confirm the app works locally at `http://127.0.0.1:8000`.
2. Run `npm run lint`.
3. Run `npm run test`.
4. Run `npm run build`.
5. Create the GitHub repository.
6. Push the `main` branch to GitHub.
7. In GitHub, set `Pages` to `Source: GitHub Actions`.
8. Wait for the `Deploy to GitHub Pages` workflow to finish.
9. Open the live Pages URL.
10. Click through the language picker, quiz flow, and result CTAs on the public site.
