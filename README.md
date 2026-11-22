# JulNow Admin web

Admin dashboard for JulNow. React + Vite + Tailwind. It has no database: it calls the Gateway.

## Run

1. Copy `.env.example` to `.env.local`
2. `npm install`
3. `npm run dev`, then open http://localhost:5173

Full setup: see `docs/SETUP.md` (A10) in julnow-infra.

## Folders

- `src/api` calls to the Gateway
- `src/components` shared UI (Button, Badge, Table, Dialog, Sidebar)
- `src/pages` one folder per screen
- `src/lib` helpers
- `src/styles/tokens.css` colours and spacing from Figma

Use Tailwind classes from the Figma tokens (`bg-primary`, `text-muted`, `border-line`). Do not write hex colours in a page.