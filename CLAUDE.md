# JulNow Admin web

Admin dashboard for JulNow. React 19 + Vite + Tailwind v4, JavaScript (not TypeScript).
It has no database and no Java: it calls the Gateway at `VITE_API_URL` (see `.env.example`).

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # must pass before a PR
```

## Folders

- `src/api/` calls to the Gateway. Until the backend APIs exist, these return mock data with the same shape as the real API. Pages never hold mock data. Mock data lives in `src/api/mock/`, switched by `VITE_USE_MOCK`.
- `docs/api-contract.md` the endpoints and shapes. `docs/TEAM-GUIDE.md` the steps to build a screen. Pages load data with `useApi` (`src/lib/useApi.js`).
- `src/components/` shared UI. `layout/` has Sidebar, TopBar, AdminLayout.
- `src/pages/<screen>/` one folder per screen.
- `src/lib/` helpers: `theme.jsx` (light/dark), `i18n.jsx` (t function).
- `src/locales/en.js`, `km.js` all text.
- `src/styles/tokens.css` colours, spacing and radius from Figma, plus the dark theme.
- `src/assets/` logo and flags.

## Rules

- Colours only through Tailwind token classes: `bg-canvas`, `bg-surface`, `bg-subtle`, `bg-hover`, `border-line`, `border-line-strong`, `text-ink`, `text-ink-soft`, `text-muted`, `bg-primary`, `hover:bg-primary-hover`, `bg-primary-subtle`, `text-primary`, `text-on-primary`, `text-success` / `bg-success-subtle`, `warning`, `danger`. Never write hex colours in a component. These work in light and dark mode without `dark:` classes.
- Spacing follows Figma: `p-2` = 8px, `p-4` = 16px, `gap-6` = 24px. Radius: `rounded-md` 8px, `rounded-lg` 12px, `rounded-xl` 16px.
- Every text the user sees goes through `t('key')` and the key is added to both `en.js` and `km.js`.
- Icons: `lucide-react` (same set as the Figma icons, which are Feather).
- Function components only. Start simple; add state only when needed.
- Login token: access token in memory, never in localStorage. Theme and language may use localStorage.
- Follow the existing code style in this repo.

## Code and docs rules

- Code and docs must not look AI-generated. Write like a human developer on this team.
- Comments: only main comments, short, simple words. No comment on every line.
- Follow the existing structure, naming and patterns in the repo. Do not add new folders or libraries unless Sopheak agrees.
- Run `npm run build` and `npm run lint` and report the result before saying a step is done.

## Figma (file key uUcxCTURdJGi4X444NZ8Dp, page DashBoard 5:119)

Build each screen from its Figma frame. Screens are 1728 wide: sidebar 260, top bar 64, content padding 32.

Figma is the guide for layout, structure and what each screen contains, not a strict rule.

- Khmer text is not in Figma. Write natural, easy Khmer yourself.
- Colours: use our tokens and keep colours few and consistent across the app. If Figma uses too many colours or is inconsistent, simplify and tell Sopheak.
- If Figma does not fit the business rules, propose a change with the reason.

| Screen | Node |
|---|---|
| 01 Log in | 1186:5923 |
| 04 MFA verification | 1190:3489 |
| 05 Overview | 921:754 |
| 06 Users | 921:1265 |
| 07 Listings | 921:1758 |
| 18 Review drawer | 921:1829 |
| Components section | 1706:6142 |

Component sets inside the Components section: Button 1442:13303, Badge 1440:13235, Search Field 1453:13490, Select Field 1453:13503, Pagination 1453:13537, Users Table 1454:13617, Listings Table 1457:13704, Table State 1458:13674, KPI Card 1442:16809, Alert Card 1443:15522, Card Header 1443:15525, Page Header 1445:13849, Segment Tab 1453:13477, Checkbox 1452:13497, Toggle 1464:13584.
Dialogs are in section 1951:14757 (e.g. Suspend 1951:14758).

## Done so far

- Template, Kantumruy Pro font
- T20 layout: Sidebar, TopBar, AdminLayout, routes for 7 pages + /login (placeholder pages)
- Light/dark mode and Khmer/English with flags

## Next

1. T20: shared components (Button, Badge, Input, Search, Select, Table, Pagination, Dialog, Card)
2. T21: Login + MFA screens (UI, mock API)
3. T37: Users page (search, filter, suspend dialog)
4. T38: Listings review (approve, request changes, reject)
5. T50: Overview (KPIs, charts)

Pong (Neak Pichvothanakpong) works on this repo with Sopheak and is learning React. Keep code easy to read.

## Git

- Sopheak creates the branch, commits and pushes. Claude never runs `git commit`, `git push`, `git checkout -b` or any command that changes git history. Claude only edits files.
- Never commit on main. One task = one branch = one PR, squash merge.
- Do not add "Co-Authored-By" lines or "Generated with Claude Code" to commit messages or PR descriptions.
