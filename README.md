# Edu-Play Early Learning Centre — website

Static Next.js site for [edu-play.com.au](https://edu-play.com.au), built for GitHub Pages.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Where things live

| What | Where |
|---|---|
| Home page | `app/page.tsx` |
| Inner pages (About, Programs, News, FAQs, Careers, Contact, …) | `app/<route>/page.tsx` |
| Text content for the inner pages | `lib/pages-content.ts` |
| Home-page text, nav links, testimonials | `lib/site-content.ts` |
| Blog posts | `content/posts.json` (one entry per post, `html` is the article body) |
| Photos | `public/images/` |
| Animal drawings and the walking parade | `components/ui/australian-animals.ts`, `components/ui/skiper39.tsx` |
| Bird-flock "Womindjeka" wordmark | `components/ui/murmuration-wordmark.tsx` |
| Hero landscape, dividers, scroll animations | `components/outback-scene.tsx`, `components/scroll-effects.tsx` |
| Shared header / footer / page banner | `components/site-chrome.tsx` |

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (branch `main`).
2. In the repository: **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it.
   The site is at `https://<username>.github.io/<repo>/` (the workflow sets the sub-folder automatically).

### Custom domain (edu-play.com.au)

1. Add a file `public/CNAME` containing just `edu-play.com.au`.
2. In **Settings → Pages → Custom domain** enter `edu-play.com.au` and tick *Enforce HTTPS*.
3. At your domain registrar, point the domain at GitHub Pages
   (`A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and a `CNAME` for `www` → `<username>.github.io`).

## Facebook posts

The "Latest from our centre" section shows the page's public posts. They are fetched **at build time**
by `scripts/fetch-facebook.mjs` (so no Facebook login is needed by visitors) and the workflow rebuilds
the site every 6 hours to pick up new posts.

To enable it:

1. Follow the steps in `.env.local.example` to get a Page access token.
2. In the repository: **Settings → Secrets and variables → Actions → New repository secret**,
   name `FACEBOOK_PAGE_TOKEN`, paste the token.
3. Run the workflow once from the **Actions** tab (or push a change).

Without a token the section shows a "Follow us on Facebook" card instead.

Locally, copy `.env.local.example` to `.env.local`, add the token and run `npm run facebook` to refresh
`public/facebook.json`.
