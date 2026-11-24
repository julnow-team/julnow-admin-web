# Team guide: how to build a screen

Read this before you start a task. The Overview page is the example to copy
(`src/pages/overview/OverviewPage.jsx`, `src/api/overview.js`, `src/api/mock/overview.js`).

## The idea

A page never knows where data comes from. It calls a function in `src/api/`.
Today that function returns mock data. When the backend is ready, it calls the Gateway.
The page does not change.

```
page  ->  useApi(getUsers, filters)  ->  src/api/users.js  ->  mock  or  Gateway
```

## Steps for a new screen (example: Users, T37)

1. **Contract.** Find the endpoint in `docs/api-contract.md`. If it is missing or wrong, fix the file first.
2. **Mock.** Create `src/api/mock/users.js`. Return the same shape as the contract.
   Filter, search and paginate inside the mock the same way the server will. Use `wait()` for the delay.
   Keep the data in a variable so actions (suspend, approve) change it.
3. **API file.** Create `src/api/users.js`. Copy `src/api/overview.js`:
   `if (USE_MOCK) return getUsersMock(params)` then `return apiClient.get('/api/admin/users?...')`.
4. **Text.** Add every key to `src/locales/en.js` and `km.js`.
5. **Page.** Create `src/pages/users/UsersPage.jsx`. Use `useApi(getUsers, { page, q, status })`.
   While there is no data show `<PageStatus error={error} onRetry={reload} />`.
   Build the layout from the Figma node in `CLAUDE.md`.
6. **Route.** Replace the `PlaceholderPage` in `src/App.jsx`.
7. **Contract status.** Mark the endpoint "done" in the status table of `docs/api-contract.md`.
8. **Check.** `npm run lint` and `npm run build` must pass. Test the page in light and dark mode, English and Khmer.

## Rules

- Mock data only in `src/api/mock/`. Never in a page or component.
- Colours only with token classes (`bg-surface`, `text-ink`). No hex colours.
- Shared parts (Button, Card, Badge, Input) are in `src/components/`. Use them, do not copy them.
  A new part used by two screens goes to `src/components/`. A part used by one screen stays in its page folder.
- Comments: only short and simple, where the code is not obvious.
- Keep a page small. If it grows past about 150 lines, move a part into its own component.

## When the backend is ready

1. Set `VITE_USE_MOCK=false` in `.env.local`, start the Gateway and open the page.
2. If the real response is different, the backend fixes it to match `docs/api-contract.md`
   (or both sides agree and change the file, the mock and the page together).
3. When every endpoint works, delete `src/api/mock/` and the `USE_MOCK` lines.

## Git (one task = one branch = one PR)

```
git checkout main
git pull
git checkout -b feature/admin-users-page
# work, then:
git add <files>
git commit -m "[T37] Admin web: users page with search and suspend dialog"
git push -u origin feature/admin-users-page
```

Open the PR, ask Sopheak to review, squash merge. Never commit on main.
