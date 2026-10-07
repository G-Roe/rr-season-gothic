---
tags: [how-to, setup]
---

# How to run locally

Run the site on your own machine to develop and test changes. Back to [[Home]].

## Prerequisites

- **Node.js** (tested with v24) and **npm** (tested with v11). Check with:

  ```bash
  node -v
  npm -v
  ```

- The repo cloned locally:

  ```bash
  git clone https://github.com/G-Roe/rr-season-gothic.git
  cd rr-season-gothic
  ```

## Steps

> [!warning] Two common Windows gotchas
> - Every `npm` command must be run **from the repo root** (the folder containing `package.json`), not your home folder. See [[#Troubleshooting]].
> - In PowerShell you may need `npm.cmd` instead of `npm`, or the one-time execution policy fix below.

1. **Open a terminal in the repo root.** In PowerShell:

   ```powershell
   cd C:\Users\graha\Documents\RPG\.projects\rr-season-gothic
   ```

   Opening the terminal from inside the project (e.g. the Terminal panel in the Claude app) starts you in the right folder already.

2. **(Windows PowerShell only, one-time) allow npm to run.** If you see "running scripts is disabled", run:

   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

   This persists across reboots and applies only to your user account. See [[#Troubleshooting]] for how to verify or undo it, and for the no-settings-change alternative.

3. **Install dependencies** (first time, and again whenever `package.json` changes):

   ```bash
   npm install
   ```

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

   If you skipped step 2, use `npm.cmd run dev` instead.

5. **Open the site** at the URL Vite prints, by default <http://localhost:5173>.

6. Edit files in `src/`. The browser reloads automatically as you save.

7. Stop the server with `Ctrl+C` in the terminal.

## Check it works

Run these before pushing changes:

| Command | What it does |
| --- | --- |
| `npm run lint` | Runs ESLint over the project. Should print no errors. |
| `npm run build` | Produces a production build in `dist/`. |
| `npm run preview` | Serves the production build locally so you can test it as deployed. |

## Troubleshooting

- **`npm` or `node` not found**: install Node.js from <https://nodejs.org> and open a new terminal.
- **PowerShell: "npm.ps1 cannot be loaded because running scripts is disabled on this system"** (`PSSecurityException` / `UnauthorizedAccess`): PowerShell's execution policy blocks npm's script wrapper. This is a Windows setting, not a project problem. Any one of these fixes it:
  - **No settings change:** use the `.cmd` version, e.g. `npm.cmd run dev`.
  - **Permanent fix:** `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
    - Persists across reboots (stored in your user registry) until you change it back.
    - Applies only to your Windows user account and only to PowerShell, not the whole machine.
    - A Group Policy, if one is set, would override it (unusual on a personal PC).
    - Verify with `Get-ExecutionPolicy -List`: `CurrentUser` should show `RemoteSigned`.
    - Undo with `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Undefined`.
  - **Avoid PowerShell:** run the commands from Command Prompt or Git Bash instead.
- **`ENOENT: no such file or directory, open '...\package.json'`** (e.g. `C:\Users\graha\package.json`): you're in the wrong folder. npm looks for `package.json` in the current directory, so `cd` into the repo root (the folder containing `package.json`) before running any `npm` command. The npm log (in `%LOCALAPPDATA%\npm-cache\_logs\`) shows the folder it ran in on the `verbose cwd` line.
- **Port already in use**: Vite picks the next free port and prints it, so use the URL it shows. Or stop the other process.
- **Odd errors after pulling changes**: re-run `npm install`. If that doesn't help, delete `node_modules/` and run it again.
- **`npm audit` warnings** after install: these come from dependencies and don't stop the site running. Don't run `npm audit fix` casually, as it can change dependency versions.

## Related

- Project README: `README.md` (event format, images, deployment)
