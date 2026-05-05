# Mercury Report — 2025-05-04
## Performance & Engineering Audit

> **Status: YELLOW** — Build passes, but lint errors, security vulnerabilities, and missing SEO infra are blocking a green score.

---

### Build Integrity

| Check | Result | Details |
|-------|--------|---------|
| `npx next build` | ✅ PASS | Exit code 0, 45 pages generated (14 static, 5 SSG blog, 10 SSG solutions, 17 dynamic) |
| Build time | ~5.0s compile + 272ms static gen | Turbopack active |
| Deprecated warning | ⚠️ `middleware.ts` → `proxy` | Next.js 16 wants proxy convention, not middleware |
| `npm run lint` | ❌ 53 problems | 38 errors, 15 warnings |
| `tsc --noEmit` | ✅ No output | Type check passes |

**Build log excerpt:**
```
▲ Next.js 16.2.4 (Turbopack)
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
✓ Compiled successfully in 5.0s
✓ Generating static pages using 7 workers (45/45) in 272ms
```

---

### Performance Metrics

| Metric | Value | Target | Status | Notes |
|--------|-------|--------|--------|-------|
| LCP | UNABLE TO MEASURE | < 2.5s | ⚠️ | No Chrome available in this environment |
| INP | UNABLE TO MEASURE | < 200ms | ⚠️ | No Chrome available |
| CLS | UNABLE TO MEASURE | < 0.1 | ⚠️ | No Chrome available |
| TTFB | UNABLE TO MEASURE | < 600ms | ⚠️ | No Chrome available |
| FCP | UNABLE TO MEASURE | < 1.8s | ⚠️ | No Chrome available |
| Build size | 516 MB | — | 🔴 | `.next/` is 516MB; `three` alone is 38MB + `three-stdlib` 29MB |
| Largest JS chunk | 884 KB | — | 🟡 | Single chunk; likely Three.js bundle |
| Static chunks total | 1.7 MB | — | 🟡 | Reasonable for R3F app |
| Server output | 53 MB | — | 🟡 | API routes + dynamic pages |

**Lighthouse:** Unable to run — `ChromeNotInstalledError`. Chrome/Chromium not present on this macOS environment. Recommend installing Chrome or using a CI runner with Chrome for automated Lighthouse runs.

**Performance concerns identified:**
1. **2 raw `<img>` tags** instead of `<Image />` from `next/image` — slower LCP, higher bandwidth (lint warnings at `src/components/`)
2. **R3F scene loaded globally** — `CanvasBackground` + `FloatingOrbs` render on every page (home, blog, solutions). No lazy loading or route-based code splitting for the 3D scene.
3. **No image optimization** — `public/` contains SVGs and an `audio/` directory; no `<Image>` usage means no automatic WebP/AVIF conversion.
4. **Bundle bloat** — `three` (38MB) + `three-stdlib` (29MB) are full dependencies. `@react-three/drei` (2.9MB) and `@react-three/fiber` (2.3MB) add to it. Consider tree-shaking or dynamic imports for R3F scenes.

---

### Accessibility Audit

| Check | Result | Details |
|-------|--------|---------|
| axe-core (remote) | ❌ FAILED | Package `axe-core-cli` 404 on npm registry |
| axe-core (local HTML) | ❌ FAILED | Chromedriver crash when scanning `.next/server/app/index.html` |
| Manual inspection | ⚠️ CONCERNS | 2 `<img>` warnings, no automated alt-text enforcement |

**Accessibility issues identified:**
1. **No automated scan possible** — axe-core CLI package appears removed/renamed from npm. Need to switch to `@axe-core/cli` (installed globally as 4.11.3) or use Playwright + `@axe-core/react` in CI.
2. **Raw `<img>` elements** — 2 instances in components. These bypass Next.js automatic `alt` enforcement and image optimization.
3. **No skip-link verification** — Cannot verify without browser testing.
4. **Keyboard navigation** — Not tested; R3F canvas may trap focus.

---

### SEO Infrastructure

| Asset | Status | Location | Issue |
|-------|--------|----------|-------|
| `sitemap.xml` | ❌ MISSING | N/A | No sitemap.ts or sitemap.xml anywhere |
| `robots.txt` | ❌ MISSING | N/A | No robots.ts or robots.txt anywhere |
| `manifest.json` | ❌ MISSING | N/A | No PWA manifest |
| Meta tags (home) | ✅ PRESENT | `src/app/layout.tsx` | Complete OG + Twitter + canonical |
| Meta tags (blog index) | ✅ PRESENT | `src/app/blog/page.tsx` | Basic metadata export |
| Meta tags (blog posts) | ⚠️ PARTIAL | `src/app/blog/[slug]/page.tsx` | Uses blog-posts.json metaDescription but no JSON-LD Article schema |
| Meta tags (pricing) | ❌ MISSING | `src/app/pricing/page.tsx` | No metadata export at all |
| Meta tags (solutions) | ❌ MISSING | `src/app/solutions/[id]/page.tsx` | No metadata export at all |
| metadataBase | ✅ SET | `https://mintagree.com` | Correct canonical domain |

**SEO critical gaps:**
1. **No sitemap.xml** — Google cannot discover all 45 pages automatically. Missing SSG blog posts and solutions pages from search index.
2. **No robots.txt** — Crawlers have no crawl-delay or sitemap directive. No AI crawler rules configured.
3. **Pricing and Solutions pages have NO metadata** — No `<title>`, no description, no OG tags. These are high-intent conversion pages and will show poorly in search/social previews.
4. **No JSON-LD structured data** — Blog posts lack `Article` schema. No `SoftwareApplication`, `Product`, or `FAQPage` schema for home/pricing.
5. **No manifest.json** — Missing PWA capabilities and app icon metadata.

---

### Security Audit

| Check | Result | Details |
|-------|--------|---------|
| `npm audit` | 🔴 13 vulns | 3 low, 10 moderate |
| Critical | 0 | — |
| High | 0 | — |
| Moderate | 10 | nodemailer, postcss, uuid, drizzle-kit |

**Vulnerability breakdown:**

1. **nodemailer ≤8.0.4 — SMTP Command Injection (moderate)**
   - CVE: GHSA-c7w3-x93f-qmm8, GHSA-vvjj-xcjg-gr5g
   - Affects: `nodemailer` → `@auth/core` → `@auth/drizzle-adapter`, `next-auth`
   - **Impact:** Auth magic links could be vulnerable to SMTP injection.
   - **Fix:** Upgrade nodemailer to 8.0.7 (current latest). Requires testing auth flow.

2. **postcss <8.5.10 — XSS via unescaped `</style>` (moderate)**
   - CVE: GHSA-qx2v-qp2m-jg93
   - Affects: `next` (nested postcss)
   - **Impact:** CSS stringify output could inject HTML if user-controlled CSS is processed.
   - **Fix:** Update Next.js to 16.3.0-canary.5+ or later stable. Nested postcss is auto-updated by Next.js.

3. **uuid <14.0.0 — Missing buffer bounds check (moderate)**
   - CVE: GHSA-w5hq-g745-h8pq
   - Affects: `uuid` → `svix` → `resend`
   - **Impact:** Buffer overflow risk in v3/v5/v6 UUID generation.
   - **Fix:** Update `resend` to latest; it may have updated `svix` dependency.

4. **drizzle-kit — @esbuild-kit/esm-loader (moderate)**
   - **Impact:** Dev-only dependency; no production risk.
   - **Fix:** Update drizzle-kit to latest.

5. **Outdated dependencies (non-security):**
   - `zod` 4.4.2 → 4.4.3 (patch)
   - `react`/`react-dom` 19.2.4 → 19.2.5 (patch)
   - `typescript` 5.9.3 → 6.0.3 (major, skip for now)
   - `eslint` 9.39.4 → 10.3.0 (major, skip for now)

---

### Code Quality (Lint Errors)

**Total: 38 errors, 15 warnings**

| Category | Count | Severity | Files |
|----------|-------|----------|-------|
| `@typescript-eslint/no-explicit-any` | 20+ | Error | `auth.ts`, API routes, components |
| `react-hooks/set-state-in-effect` | 2 | Error | Cascading render bugs in components |
| `react-hooks/purity` | 2 | Error | `Math.random()` called during render |
| `react/no-unescaped-entities` | 6 | Error | Blog text using raw quotes/apostrophes |
| `react-hooks/immutability` | 1 | Error | `receipt-scene.tsx` self-referencing `useCallback` |
| `@next/next/no-img-element` | 2 | Warning | Using `<img>` instead of `<Image />` |
| `@typescript-eslint/no-unused-vars` | 7 | Warning | Dead imports across files |

**Critical code-quality bugs:**
1. **`receipt-scene.tsx` — self-referencing `useCallback`**
   - `animate` calls `requestAnimationFrame(animate)` inside itself. The dependency array `[]` means `animate` captures the initial (undefined) `animate` reference. This is a broken closure that can cause memory leaks or stale RAF loops.

2. **`setState` called synchronously in `useEffect`**
   - Two components call state setters directly inside effects without guards. Causes cascading renders and potential infinite loops.

3. **Impure functions during render**
   - `Math.random()` called during render phase. Breaks React StrictMode and SSR hydration. Must move to `useEffect` or `useCallback` with event handlers.

4. **`any` types in auth layer**
   - `session.ts` and `auth.ts` use `any` for `createdAt` handling and session augmentation. Should use proper Drizzle type inference.

---

### Design System Audit

| Token | Status | Notes |
|-------|--------|-------|
| Colors | ✅ Consistent | `--mint` (#2dd4bf) used across CTAs, glows, badges |
| Border radius | ✅ Consistent | `rounded-xl` (0.75rem), `rounded-md` (0.5rem) |
| Typography | ✅ Consistent | Inter stack, responsive scale |
| Spacing | ✅ Consistent | Tailwind scale, 4px grid |
| Shadows | ✅ Consistent | `shadow-[0_0_40px_rgba(0,0,0,0.3)]`, glow borders |
| Nav | ✅ Found | `src/components/nav.tsx` |
| Footer | ✅ Found | `src/components/footer.tsx` |
| Button (CTA) | ✅ Found | `bg-mint text-zinc-950 hover:bg-mint-hover` |
| Button (Ghost) | ✅ Found | `border-zinc-700 hover:border-zinc-600` |
| Card | ✅ Found | `border-zinc-800 bg-surface rounded-xl` |
| Prose | ✅ Found | `prose prose-invert max-w-none` on blog |

**No design system regressions detected.** All new pages (blog, careers, security, solutions) use existing component patterns.

---

### Deployment Status

| Check | Result |
|-------|--------|
| Vercel production | ✅ Active |
| Last deploy | ~1 day ago |
| Build time | 41–53s (recent production builds) |
| Custom domain | ⚠️ `mintagree.com` — DNS resolution failed from this environment (NXDOMAIN) |
| `.vercel.app` domain | ✅ Resolves via Vercel CLI |
| `.env` | ✅ DATABASE_URL, AUTH_SECRET, RESEND_API_KEY present |
| Middleware | ✅ `src/middleware.ts` active for `/dashboard/*` auth guard |

---

### Actions Taken Today

1. ✅ Ran `npx next build` — verified build passes with zero TypeScript errors
2. ✅ Ran `npm run lint` — catalogued 53 lint issues
3. ✅ Ran `npm audit` — identified 13 vulnerabilities (0 critical, 0 high)
4. ✅ Ran `npm outdated` — identified 6 outdated packages
5. ❌ Attempted Lighthouse — failed: Chrome not installed
6. ❌ Attempted axe-core — failed: CLI package 404 + chromedriver crash
7. ✅ Inspected build output — 516MB total, 884KB largest JS chunk
8. ✅ Verified SEO metadata — missing on pricing & solutions, no sitemap/robots/manifest
9. ✅ Checked design system parity — all tokens consistent across new pages

---

### Open Issues (Escalated to Gus)

| Priority | Issue | Impact | Owner |
|----------|-------|--------|-------|
| 🔴 P0 | **No sitemap.xml / robots.txt** | Search engines cannot crawl 45 pages; invisible to Google | Mercury |
| 🔴 P0 | **Pricing + Solutions pages have NO metadata** | Zero SEO value on conversion pages; bad social previews | Mercury |
| 🔴 P0 | **13 npm audit vulnerabilities** | Auth SMTP injection, CSS XSS, UUID buffer overflow | Mercury |
| 🟡 P1 | **53 lint errors** (38 errors) | Broken hooks, `any` types, impure renders — potential runtime bugs | Mercury |
| 🟡 P1 | **R3F scene loaded on every page** | Unnecessary bundle weight on blog/pricing; hurts mobile perf | Mercury |
| 🟡 P1 | **2 raw `<img>` tags** | Slower LCP, no automatic optimization | Mercury |
| 🟡 P1 | **Deprecated `middleware.ts` convention** | Will break in future Next.js version | Mercury |
| 🟡 P1 | **No manifest.json** | No PWA support, missing app icons | Mercury |
| 🟢 P2 | **No Chrome for Lighthouse/axe** | Cannot automate Core Web Vitals or a11y scans locally | Mercury |
| 🟢 P2 | **Bundle 516MB** | Large deploy artifact; may hit Vercel limits with more content | Mercury |

---

### Recommended Fixes (Priority Order)

**This Week:**
1. Create `src/app/sitemap.ts` — crawl all static/SSG routes, output XML
2. Create `src/app/robots.ts` — allow all, reference sitemap, add AI crawler rules
3. Add metadata to `src/app/pricing/page.tsx` and `src/app/solutions/[id]/page.tsx`
4. Fix `receipt-scene.tsx` — move `animate` to `useRef` + `useEffect`, eliminate self-reference
5. Fix 2 `setState-in-effect` errors — add guards or move to event handlers
6. Fix 2 `react-hooks/purity` errors — move `Math.random()` out of render
7. Replace 2 `<img>` tags with `<Image />` from `next/image`

**Next Week:**
8. Upgrade `nodemailer` to 8.0.7 + test auth magic link flow
9. Upgrade `next` to latest stable (patches postcss XSS)
10. Upgrade `resend` to latest (patches uuid vulnerability)
11. Upgrade `zod` and `react`/`react-dom` patches
12. Refactor `middleware.ts` → `proxy` convention per Next.js 16 docs
13. Add `public/manifest.json` for PWA

**This Month:**
14. Implement route-based code splitting for R3F scenes (lazy load on home only)
15. Add JSON-LD structured data: `Article` for blog, `SoftwareApplication` for home, `FAQPage` for FAQ
16. Set up Chrome in CI or migrate Lighthouse/axe to GitHub Actions
17. Run bundle analyzer; investigate tree-shaking `three` and `three-stdlib`
18. Enforce lint-as-gate: block deploy on `npm run lint` errors

---

### Baseline Comparison

No previous Lighthouse or performance baseline exists (first Mercury run on this environment). Next audit on 2025-05-08 should include:
- Lighthouse scores from CI or installed Chrome
- axe-core violation count (once CLI tooling is fixed)
- Build size delta vs today’s 516MB
- Lint error count delta vs today’s 38 errors

---

**Reported by:** Mercury (MintAgree Engineering Director)  
**Date:** 2025-05-04 11:00 AM SAST  
**Next audit:** 2025-05-08 (Mon/Thu schedule)
