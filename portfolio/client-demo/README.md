# Animation Portfolio — Static Website

A minimal, dark, cinematic portfolio for an animation student / 3D & motion artist.
Built with **plain HTML, CSS and vanilla JavaScript** — no frameworks, no build step, no backend.

## Project structure

```
├── index.html        Home (hero, intro, featured work, skills, process, CTA)
├── about.html        Bio, skills, software, process, education
├── projects.html     All projects + category filters + detail modal
├── contact.html      Social links + validated contact form (mailto)
├── css/style.css     All styling (design tokens at the top)
├── js/script.js      All interactivity + PROJECT DATA (edit here!)
├── assets/
│   ├── images/       Placeholder artwork — replace with your own
│   ├── videos/       Put your MP4/WebM reels here
│   └── icons/        Favicon
└── README.md
```

## Run locally

Just double-click `index.html`, or right-click → **Open with Live Server** in VS Code.
No install, no build.

---

## Customize (10-minute checklist)

Everything marked with `✏️` comments in the code is meant to be replaced.

| What | Where |
|---|---|
| Your name | Search & replace `[ARTIST NAME]`, `[Artist Name]` and `[Name]` in all 4 HTML files |
| Email address | All 4 HTML footers, `contact.html` links, and `TO_EMAIL` in `js/script.js` |
| Social links | Footer of every page + contact page (`yourhandle` placeholders) |
| Profile photo | Replace `assets/images/profile.svg` (square ~800×800 JPG/PNG works best) |
| Hero artwork | Replace `assets/images/hero-art.svg` or swap the `<img>` for a `<video>` (comment in `index.html` shows how) |
| Project thumbnails | Replace `assets/images/project-01.svg` … `project-06.svg` (~1200×800) |
| Project details (title, category, year, description, process, tools, gallery) | `PROJECTS` object at the top of `js/script.js` |
| Project cards on pages | Copy/paste a card block in `index.html` / `projects.html`; `data-project` must match a key in `PROJECTS` |
| Bio, skills, interests, tools, education | `about.html` (placeholder entries clearly marked) |
| Colors / theme | `:root` variables at the top of `css/style.css` |

### Adding a video to a project

1. Drop `my-film.mp4` into `assets/videos/`.
2. In `js/script.js`, set that project's `video: "assets/videos/my-film.mp4"`.
3. The detail modal will automatically show a player (muted, loop, controls) with the thumbnail as poster.

Videos are **never** auto-loaded — cards always use a light poster image + play icon.

---

## Deploy (free, pick one)

### Vercel
1. Push the project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
3. Import your GitHub repository.
4. Framework preset: **Other**. No build command, no output directory needed.
5. Click **Deploy**.

### Render
1. Push the project to GitHub.
2. Go to [render.com](https://render.com) → **New → Static Site**.
3. Connect the repository.
4. Build command: **leave empty**. Publish directory: **`.`** (or `/`).
5. Click **Create Static Site**.

### Netlify
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**.
2. Drag-and-drop the project folder. Done.

### GitHub Pages
1. Push to GitHub → repo **Settings → Pages**.
2. Source: **Deploy from a branch** → `main` → `/ (root)` → Save.
3. Your site appears at `https://<username>.github.io/<repo>/`.

> All page links in this project are relative (`index.html`, `css/style.css`, …), so it works
> from any folder or sub-path, including GitHub Pages project sites.

No environment variables, API keys, databases or npm installs are required anywhere.

---

## Notes

- The contact form uses client-side validation + `mailto:` — perfect for static hosting.
- Images use `loading="lazy"`; videos use poster images and `preload="metadata"`.
- Accessibility: semantic HTML, aria labels, focus states, keyboard-friendly menu/modal, `prefers-reduced-motion` support.
- Placeholders (`[Artist Name]`, `[Institute Name]`, etc.) are intentionally obvious — replace them with real content before publishing.