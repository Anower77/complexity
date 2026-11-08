# Deployment Guide: Complexity

> Target: GitHub Pages  
> Automation: GitHub Actions  
> Static Output: `dist/`

---

## 1. Hosting Architecture

Complexity is statically compiled by Astro into `dist/` and hosted on GitHub Pages.

- **Account/Repo**: `Anower77/complexity`
- **Default GitHub Pages URL**: `https://anower77.github.io/complexity/`
- **Custom Domain Ready**: `complexity.github.io` (or apex domain via CNAME)

---

## 2. GitHub Actions Deployment Workflow

The deployment is automated via `.github/workflows/deploy.yml`:

1. **Trigger**: Any push to the `main` branch or manual `workflow_dispatch`.
2. **Setup**: Ubuntu runner with Node.js 22.
3. **Verification**:
   - `npm test`: Runs Vitest test suite (reading time, progress, content validation, navigation engine).
   - `npm run typecheck`: Runs `tsc --noEmit` under strict TypeScript rules.
4. **Build**:
   - Sets `NODE_ENV=production`, `SITE=https://anower77.github.io`, `BASE_URL=/complexity`.
   - Runs `npm run build` which produces pre-rendered HTML in `dist/`.
5. **Deployment**:
   - Uploads `dist/` as a Pages artifact.
   - Invokes `actions/deploy-pages@v4` with `pages: write` and `id-token: write` permissions.

---

## 3. GitHub Repository Configuration

To enable GitHub Pages in your repository settings:
1. Navigate to **Settings → Pages** in `Anower77/complexity`.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` — the workflow will trigger, verify, build, and deploy automatically.

---

## 4. Troubleshooting Common Issues

### Issue: 404 for Assets / Links on GitHub Pages
- **Cause**: Assets or links were authored with hardcoded `/courses` instead of using `formatPath('/courses')`.
- **Fix**: Always wrap internal URLs in `formatPath()`.

### Issue: Blank Screen in Dark Mode on First Load
- **Cause**: External scripts executing before DOM theme class application.
- **Fix**: Keep the zero-dependency inline script in `src/layouts/BaseLayout.astro` `<head>`.
