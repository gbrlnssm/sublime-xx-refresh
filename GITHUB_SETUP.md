# GitHub setup – link this project to your repo

Your project is already a Git repo with a `.gitignore` and all files **staged**. Follow these steps to create the first commit and push to GitHub.

---

## 1. Create the first commit (in Terminal)

From the project root (`NAV-XX1`):

```bash
cd /Users/gabrielnessim/Cursor/NAV-XX1
git commit -m "Initial commit: Nav prototype xx1-xx6, assets, feed content"
```

If you see an error like `unknown option 'trailer'`, your Git config is adding a `--trailer` option that your Git version (2.22) doesn’t support. Fix it by either:

- **Option A:** Upgrade Git (e.g. `brew install git` if you use Homebrew), or  
- **Option B:** Temporarily bypass the extra config and commit with:
  ```bash
  GIT_CONFIG_PARAMETERS="'include.path= '" git commit -m "Initial commit: Nav prototype xx1-xx6, assets, feed content"
  ```
  or find and edit the config that adds `--trailer` (often in an included file like `~/.githubconfig` or `~/.gitcinclude`).

---

## 2. Add your GitHub remote

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Example if your repo is `https://github.com/gabrielnessim/NAV-XX1`:

```bash
git remote add origin https://github.com/gabrielnessim/NAV-XX1.git
```

---

## 3. Push to GitHub

If your branch is `master` and the remote has no history yet:

```bash
git push -u origin master
```

If GitHub created the repo with a default `main` branch and you want to match that:

```bash
git branch -M main
git push -u origin main
```

You may be prompted to sign in (browser or credential helper).

---

## 4. Test the project locally

Open any prototype in your browser (double‑click or “Open with”):

- **xx1:** `xx1/index.html`
- **xx2:** `xx2/index.html`
- **xx3:** `xx3/index.html`
- **xx4:** `xx4/index.html`
- **xx5:** `xx5/index.html`
- **xx6:** `xx6/index.html`
- **xx7–xx9:** `xx7/index.html`, etc.
- **Landing page:** open the repo root `index.html` (or run a local server and go to `/`).

Or from Terminal:

```bash
open xx1/index.html
# or
open xx6/index.html
```

For a simple local server (optional, avoids some path issues):

```bash
# Python 3
python3 -m http.server 8000
# Then open http://localhost:8000/xx1/ or http://localhost:8000/xx6/
```

---

## Summary

| Step | Command / action |
|------|-------------------|
| 1. Commit | `git commit -m "Initial commit: Nav prototype xx1-xx6, assets, feed content"` |
| 2. Add remote | `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git` |
| 3. Push | `git push -u origin master` (or `main` after `git branch -M main`) |
| 4. Test locally | Open `xx1/index.html` … `xx6/index.html` or use `python3 -m http.server 8000` |

After this, your work is saved on GitHub and you can keep pushing with `git add`, `git commit`, and `git push`.

---

## 5. Deploy to GitHub Pages

To publish the project (including the landing page) on GitHub Pages:

1. On GitHub, open your repo **Settings** → **Pages** (in the left sidebar).
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`) → **/ (root)** → **Save**
3. After a minute or two, the site will be live at:
   - **https://YOUR_USERNAME.github.io/NAV-XX1/**

Visitors will see the landing page with links to **xx1** through **xx9** and the **Design System**. Each link goes to that version’s prototype (e.g. `.../NAV-XX1/xx3/`).
