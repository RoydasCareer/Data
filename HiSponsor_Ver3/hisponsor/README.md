# HiSponsor — Customization & Operation Guide (English)

> A bilingual (Korean/English) global visa sponsorship job platform.  
> Built with React + Vite + TailwindCSS. No backend required to start.

---

## 📁 Project Structure

```
hisponsor/
├── index.html                  ← Browser tab title & SEO meta tags
├── package.json                ← Project dependencies (do not edit unless adding packages)
├── vite.config.ts              ← Build tool config (do not edit)
├── tsconfig.json               ← TypeScript config (do not edit)
│
└── src/
    ├── main.tsx                ← App entry point (do not edit)
    ├── styles/
    │   └── index.css           ← Global CSS (font, background, scrollbar)
    └── app/
        ├── App.tsx             ← Root layout: assembles Header + Catalogue + Footer
        ├── config.ts           ★ MAIN CUSTOMIZATION FILE — edit this first!
        ├── data/
        │   └── posts.ts        ★ All post/article data lives here
        └── components/
            ├── Header.tsx      ← Top navigation bar
            ├── PostCatalogue.tsx ← Hero banner + category tabs + card grid
            ├── PostCard.tsx    ← Individual card (grid & list view)
            ├── FilterPanel.tsx ← Left sidebar filter (category + country)
            └── Footer.tsx      ← Newsletter + links + social + copyright
```

---

## ✏️ How to Customize — Quick Reference

### 1. Change site name, contact, social links
**Edit:** `src/app/config.ts`

```ts
siteName: 'HiSponsor',          // ← change to your brand name
contact: {
  email: 'hello@hisponsor.com', // ← your email
  phone: '+82 02-000-0000',     // ← your phone
},
social: {
  linkedin: 'https://...',      // ← your LinkedIn URL
},
```

### 2. Change hero banner text
**Edit:** `src/app/config.ts` → `hero` section

```ts
hero: {
  badgeText: '비자 스폰서십 전문 플랫폼',
  headlineEn: 'Find Your Path to\nInternational Career Growth',
  subtitleKr: '해외 취업에 필요한...',
}
```

### 3. Add / edit / delete a post card
**Edit:** `src/app/data/posts.ts` → `MOCK_POSTS` array

To **add** a new post, copy this template and paste it at the top of `MOCK_POSTS`:
```ts
{
  id: '13',                        // unique number (increment from last)
  title: 'English Title Here',
  titleKr: '한국어 제목',
  excerpt: 'English summary...',
  excerptKr: '한국어 요약...',
  category: 'jobs',                // 'jobs' | 'information' | 'template'
  country: 'USA',                  // must match a COUNTRIES id
  date: '2025-05-01',             // YYYY-MM-DD
  author: 'Author Name',
  authorInitial: 'A',
  image: 'https://image-url.jpg',
  readTime: 5,
  views: 100,
  isNew: true,                     // remove this line to hide NEW badge
},
```

To **delete** a post, remove the entire `{ ... }` block for that post.

### 4. Change category colors
**Edit:** `src/app/data/posts.ts` → `CATEGORY_META`

```ts
jobs: { color: 'bg-orange-50 text-orange-700 border-orange-200' },
// Change 'orange' to: red, green, yellow, pink, indigo, etc.
```

### 5. Add or remove countries in the filter
**Edit:** `src/app/data/posts.ts` → `COUNTRIES` array

```ts
{ id: 'France', flag: '🇫🇷', labelEn: 'France', labelKr: '프랑스' },
// The id must match the 'country' field in your posts
```

### 6. Change footer destination countries
**Edit:** `src/app/config.ts` → `topDestinations` array

### 7. Change statistics numbers (hero area)
**Edit:** `src/app/config.ts` → `stats` array

---

## 🖼️ Image Assets

Located in `src/assets/`:
| File | Used in |
|------|---------|
| `Horizontal_Logo.png` | Header (desktop), Footer |
| `Vertical_Logo.png` | Header (mobile) |
| `Web_Header_Banner.png` | Hero section background |
| `favicon-32x32.png` | Browser tab icon |

To replace a logo: swap the file (keep the same filename) or update the import path in `Header.tsx` / `Footer.tsx`.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies (run once)
cd E:\jobcollect\Antigravity\hisponsor
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:5173
```

## 📦 How to Build for Deployment (Cloudflare Pages / GitHub Pages)

```bash
npm run build
# Output folder: dist/
# Upload the dist/ folder to Cloudflare Pages or GitHub Pages
```

---

## 🔧 Component Reference

| Component | File | What it controls |
|-----------|------|-----------------|
| Header | `Header.tsx` | Logo, nav links, search bar, CTA buttons |
| Hero banner | `PostCatalogue.tsx` (top section) | Background image, headline, search input |
| Category tabs | `PostCatalogue.tsx` (tab row) | All / Jobs / Info / Template tabs |
| Post grid | `PostCatalogue.tsx` (grid section) | Card layout, sort dropdown, view toggle |
| Single card | `PostCard.tsx` | Card design, bookmark button |
| Sidebar filter | `FilterPanel.tsx` | Category checkboxes, country checkboxes |
| Footer | `Footer.tsx` | Newsletter form, links, social icons |

---

## 📌 Connecting to a Real Database (Future)

When ready to connect Supabase:
1. Replace `MOCK_POSTS` in `posts.ts` with a `useEffect` + `supabase.from('posts').select()`
2. Add your Supabase URL and anon key to a `.env` file
3. See `HiSponsor-완전정복-가이드.md` for the full database schema
