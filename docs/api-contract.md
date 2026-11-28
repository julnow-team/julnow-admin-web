# Admin API contract (draft)

The Admin web is built first with mock data. This file is the agreement between the web and the backend.
The mock files in `src/api/mock/` must return exactly these shapes. Backend builds the endpoints from this file.
If a shape changes, change this file, the mock and the page in the same PR.

Example numbers come from the Figma Overview screen.

## Rules for every endpoint

- Called through the Gateway (`VITE_API_URL`), path starts with `/api/admin/...`
- Header `Authorization: Bearer <access token>`. The Gateway checks the JWT and the ADMIN role.
- JSON field names are camelCase. Dates are ISO text (`2026-12-01T08:30:00Z`). Money is a number in USD.
- Fixed values use the same text as the database CHECK (`ACTIVE`, `PENDING_REVIEW`).
- List endpoints take `page` (starts at 0), `size` and return `{ items, page, size, totalItems, totalPages }`.
- Errors return `{ "code": "MFA_INVALID", "detail": "message", "attemptsLeft": 3 }` with status 400, 401, 403, 404, 409 or 429.
  `code` is a short UPPER_SNAKE text, the web uses it to decide what to show. `detail` is a message for the person.
  `attemptsLeft` is only sent by the MFA endpoint.
- Stats endpoints take `range` = `7d`, `30d` or `90d` (default `30d`). The backend may support only `30d` at first.
  The response says which range was used, in `range`.
- The backend never sends sentences for the screen. It sends codes and numbers, the web writes the text with `t()` (English and Khmer).

## Gateway routes

| Path | Service |
|---|---|
| `/api/admin/auth/**`, `/api/admin/users/**`, `/api/admin/me` | auth-service (8081) |
| `/api/admin/listings/**` | listing-service (8082) |
| `/api/admin/bookings/**` | booking-service (8083) |

The Gateway only routes and checks the JWT. It does not collect data from the services.

## Status

Priority: P1 = needed for the demo, P2 = after P1, Later = mock only, no real endpoint yet.

| Endpoint | Web task | Priority | Mock | Backend |
|---|---|---|---|---|
| GET /api/admin/auth/stats | T50 | P1 | needs update | not started |
| GET /api/admin/listings/stats | T50 | P1 | needs update | not started |
| GET /api/admin/bookings/stats | T50 | P1 | needs update | not started |
| MRR 12-month series | T50 | Later | todo | no endpoint |
| Recent activity | T50 | Later | todo | no endpoint |
| Export report | T50 | Later | none, the button is disabled | no endpoint |
| GET /api/admin/me | T20 | P1 | done (`navigation.js`) | not started |
| GET /api/admin/nav-counts | T20 | Later | done (`navigation.js`), mock only | no endpoint |
| POST /api/admin/auth/login | T21 | P1 | done | not started |
| POST /api/admin/auth/mfa | T21 | P1 | done | not started |
| POST /api/admin/auth/mfa/resend | T21 | P1 | done | not started |
| POST /api/admin/auth/refresh | T21 | P2 | not built | not started |
| POST /api/admin/auth/logout | T21 | P2 | not built | not started |
| GET /api/admin/users | T37 | P1 | todo | not started |
| PATCH /api/admin/users/{id}/status | T37 | P1 | todo | not started |
| GET /api/admin/listings | T38 | P1 | todo | not started |
| POST /api/admin/listings/{id}/moderation | T38 | P1 | todo | not started |

## Overview (T50)

The Overview page calls the three stats endpoints at the same time. Each section of the page uses its own
`useApi`, so if one service is down only its sections show an error.

The web puts some numbers together itself:

- Open risk cases = `auth.casesFromUsers` + `listings.casesFromSystem`
- Owner journey = signups, trial and paid from auth, first listing from listings, first booking from bookings.
  The percent of each step is the step divided by `signups`.
- Plan share in Subscription health = plan `count` divided by the sum of all plan counts.
- Alert cards use the same data: late owners from `subscriptionHealth.lateOwners`, new and flagged listings
  from `submissions`.

`change` is the percent against the period before. If the backend cannot work it out (for example revenue, there is no
invoices table yet), it sends `null` and the web hides the badge. Otherwise the web shows the real sign, `+` or `-`.

Subtitles on the page: Subscription health shows the month of `asOf`. Owner journey shows the label of the chosen
range ("Last 30 days"), not a month.

### GET /api/admin/auth/stats?range=30d

```json
{
  "range": "30d",
  "asOf": "2026-09-30T09:00:00Z",
  "totalUsers": { "value": 12847, "change": 8.2 },
  "monthlyRevenue": { "value": 42698, "change": 11.4 },
  "paidSubscriptions": { "value": 1818, "change": 8.7, "onTrial": 94 },
  "subscriptionHealth": {
    "plans": [
      { "code": "PRO", "price": 29, "count": 1102 },
      { "code": "STARTER", "price": 15, "count": 716 },
      { "code": "TRIAL", "price": 0, "count": 94 }
    ],
    "lateOwners": 38,
    "renewalsNext7Days": 72,
    "trialsEndingNext7Days": 31,
    "revenueAtRisk": 850
  },
  "ownerJourney": { "signups": 218, "startedTrial": 194, "convertedToPaid": 149 },
  "casesFromUsers": 25
}
```

- `monthlyRevenue` is the monthly price of all ACTIVE subscriptions added together (1,102 x $29 + 716 x $15 = $42,698).
- `paidSubscriptions.value` counts ACTIVE subscriptions (Pro and Starter). `onTrial` counts TRIALING.
- `plans` uses `subscriptions.plan_code` and `plans.price_monthly`. The web writes the plan names.
- `lateOwners` = owners with a PAST_DUE subscription (late, or paused after the 3 day `grace_until`).
- `revenueAtRisk` = monthly price of those PAST_DUE subscriptions added together.
- `casesFromUsers` = `reports` with status OPEN, REVIEWING or ESCALATED.
- `ownerJourney` counts inside the `range`. `subscriptionHealth` is the situation now (`asOf`).

### GET /api/admin/listings/stats?range=30d

```json
{
  "range": "30d",
  "activeListings": { "value": 3462, "change": 12.5 },
  "pausedListings": 142,
  "submissions": {
    "submitted": 24,
    "autoPublished": 17,
    "flagged": 7,
    "flags": [
      { "type": "DUPLICATE_PHOTOS", "count": 3 },
      { "type": "PRICE_TOO_HIGH", "count": 2 },
      { "type": "BANNED_PHONE", "count": 2 }
    ]
  },
  "casesFromSystem": 9,
  "publishedFirstListing": 161,
  "riskExceptions": [
    {
      "listingId": 48213,
      "code": "JN-48213",
      "title": "Riverside Studio - BKK1",
      "categoryCode": "RENTAL",
      "subcategoryCode": "ROOM",
      "level": "HIGH",
      "flags": [
        { "type": "DUPLICATE_PHOTOS" },
        { "type": "PRICE_TOO_HIGH", "percentAboveAverage": 43 }
      ]
    }
  ]
}
```

- `activeListings` counts status ACTIVE.
- `pausedListings` counts status PAUSED. It also counts listings paused for another reason (admin or report), because the
  database does not keep the reason. The Overview shows it next to late owners.
- `submissions` is about today, it does not use `range`. `autoPublished` = `submitted` - `flagged` (no new column).
  `flagged` = listings submitted today with an unresolved flag.
- `casesFromSystem` = `listing_flags` with `resolved = false`.
- `publishedFirstListing` = owners whose first listing became ACTIVE inside the `range`.
- `riskExceptions`: at most 4 listings with unresolved flags, HIGH first, then newest.
  Only system flags. "Reported by tenant" is not in the API for now (it would need auth data), it stays in the mock only.
- `level` = HIGH when the listing has 2 or more unresolved flags or has BANNED_PHONE, otherwise MEDIUM.
- `code` = `JN-` + listing id.
- Each flag is data, not a sentence. The web writes the sentence with `t()`, the same as Recent activity.
  Only `PRICE_TOO_HIGH` has an extra field, `percentAboveAverage` (a whole number). `DUPLICATE_PHOTOS` and `BANNED_PHONE` have only `type`.
  The backend works out the percent when it runs the price check, `listing_flags.detail` is not sent to the web.

### GET /api/admin/bookings/stats?range=30d

```json
{ "range": "30d", "ownersWithFirstBooking": 87 }
```

`ownersWithFirstBooking` = owners whose first booking was created inside the `range`.

### Mock only (Later)

No real endpoint and no new table for these. The web gets them from `src/api/mock/` and the shape below is only
the shape the mock follows.

**MRR 12-month series** (chart "Monthly revenue"):
`{ "series": [{ "month": "2025-10", "value": 18200 }, ...] }` with 12 items, oldest first.

**Recent activity**: `{ "items": [{ "type": "BOOKING_CREATED", "at": "2026-09-30T08:58:00Z", ... }] }`

| `type` | Extra fields |
|---|---|
| BOOKING_CREATED | `actorName`, `listingTitle`, `bookingCode` |
| LISTING_AUTO_PUBLISHED | `listingTitle` |
| PAYMENT_FAILED | `actorName`, `daysLeft` |
| PLAN_UPGRADED | `actorName`, `planCode` |
| SUBSCRIPTION_RENEWED | `actorName`, `planCode`, `amount` |
| LISTING_REPORTED | `listingTitle` |

The web shows "2 min ago" from `at`.

**Reported listing in Risk exceptions**: the mock adds one item with `"level": "REPORTED"` and `"flags": []`
(a tenant reported the listing). The real endpoint never sends it, because it would need data from auth-service.

**Export report**: the button stays disabled. Later it will download a file for the chosen `range`.

**nav-counts**: `GET /api/admin/nav-counts` (see below) is mock only for now.

## Current admin and sidebar counts

`GET /api/admin/me` returns `{ "fullName": "Pon Somnang", "roleName": "Super admin" }`
(`users.full_name` and `admin_roles.name`). When `admin_role_code` is null the backend sends `"roleName": "Admin"`.

`GET /api/admin/nav-counts` returns `{ "flaggedListings": 7, "openCases": 34 }`. Mock only (Later): it needs data from
two services and there is no real endpoint yet.

## Login and MFA (T21)

`POST /api/admin/auth/login` with `{ "email", "password" }` sends a 6 digit code by EMAIL
(`otp_codes.purpose = ADMIN_MFA`) and returns:

```json
{ "mfaToken": "…", "expiresIn": 300, "resendAfter": 60 }
```

`expiresIn` is how many seconds the `mfaToken` and the code live. `resendAfter` is how many seconds the admin must
wait before asking for a new code. The web shows both countdowns from these numbers.

`POST /api/admin/auth/mfa` with `{ "mfaToken", "code" }` returns `{ "accessToken", "admin": { "fullName", "roleName" } }`.

`POST /api/admin/auth/mfa/resend` with `{ "mfaToken" }` returns `{ "expiresIn": 300, "resendAfter": 60 }`.
It sends a **new code** and gives **a new 5 minutes**: the same `mfaToken` is valid for 5 more minutes, and the wrong
tries start from zero again.

Rules:

- The `mfaToken` and the code live 5 minutes (`expiresIn`, `otp_codes.expires_at`).
- A wrong code can be tried 5 times. After the 5th wrong try the code is dead. The admin asks for a new code with resend.
- Resend must be at least 60 seconds after the last code (`resendAfter`). If sooner: 429 with a `Retry-After` header
  (seconds).
- There is no password lockout for the MVP.
- The access token and the `mfaToken` stay in memory only.
- A request that carries a token and gets 401 ends the session, the web goes to `/login`. A 401 from login or mfa
  (wrong password or code) does not.

| `code` | Status | When |
|---|---|---|
| LOGIN_INVALID | 401 | Wrong email or password, or the account is not an admin or is suspended. One message for all, so nobody can check which emails exist. |
| MFA_INVALID | 401 | Wrong code. `attemptsLeft` says how many tries remain. |
| MFA_LOCKED | 401 | 5 wrong tries, the code is dead. Ask for a new code. |
| MFA_EXPIRED | 401 | `mfaToken` or code is older than 5 minutes. Go back to login. |
| MFA_RESEND_TOO_SOON | 429 | Resend before 60 seconds. |
| TOKEN_EXPIRED | 401 | P2: the access token ran out, the web asks for a new one with refresh. Not used yet. |
| NETWORK | none | Not from the server. The web uses it when it cannot reach the Gateway. |

### Refresh and logout (P2, not built yet)

Until this is built, a page refresh logs the admin out (the access token is only in memory).

- `POST /api/admin/auth/refresh` has no body. It reads the refresh token from an httpOnly, Secure, SameSite cookie
  (path `/api/admin/auth`) and returns `{ "accessToken", "admin" }`. It sets a new refresh token each time and revokes
  the old one (`refresh_tokens.revoked_at`). The web calls it when the app opens. If it gives 401 the web goes to `/login`.
- `POST /api/admin/auth/logout` revokes the refresh token, clears the cookie and returns 204.
- Web side later: `credentials: 'include'` in `client.js`, try refresh once on a 401, and CORS on the Gateway with
  `allowCredentials` and the exact web origin.

## Users (T37)

`GET /api/admin/users?page=0&size=10&q=sok&status=ACTIVE&role=OWNER`

```json
{
  "items": [
    {
      "id": 12,
      "fullName": "Sok Dara",
      "email": "dara@example.com",
      "phone": "012345678",
      "role": "OWNER",
      "status": "ACTIVE",
      "lastLoginAt": "2026-12-01T08:30:00Z",
      "createdAt": "2026-10-02T03:10:00Z"
    }
  ],
  "page": 0, "size": 10, "totalItems": 1, "totalPages": 1
}
```

`role`: TENANT, OWNER, ADMIN. `status`: ACTIVE, SUSPENDED, DELETED.

`PATCH /api/admin/users/{id}/status` with `{ "status": "SUSPENDED", "reason": "..." }` returns the updated user.
An admin can only set `ACTIVE` or `SUSPENDED`. Any other value gives 400. Backend writes one row in `audit_logs`.

## Listings (T38)

`GET /api/admin/listings?page=0&size=10&q=&status=PENDING_REVIEW&flagged=true`

```json
{
  "items": [
    {
      "id": 31,
      "title": "Studio near AEON Mall",
      "category": "RENTAL",
      "subcategory": "ROOM",
      "ownerName": "Sok Dara",
      "price": 250,
      "priceUnit": "MONTH",
      "province": "Phnom Penh",
      "status": "PENDING_REVIEW",
      "flags": ["DUPLICATE_PHOTOS"],
      "createdAt": "2026-12-01T08:30:00Z"
    }
  ],
  "page": 0, "size": 10, "totalItems": 1, "totalPages": 1
}
```

`category`: RENTAL, STAY, TRAVEL (from `subcategories.category_id`). `subcategory` is the `subcategories.code` (ROOM, HOTEL, MOTO ...).
`status`: PENDING_REVIEW, ACTIVE, CHANGES_REQUESTED, REJECTED, PAUSED.
`flags` values: DUPLICATE_PHOTOS, PRICE_TOO_HIGH, BANNED_PHONE (only flags not yet resolved).

`POST /api/admin/listings/{id}/moderation` with `{ "action": "APPROVE" }` or
`{ "action": "REQUEST_CHANGES" | "REJECT" | "PAUSE", "reason": "..." }`.
Reason is required for REQUEST_CHANGES, REJECT and PAUSE. Returns the updated listing.
Backend writes `moderation_logs` and sends a notification to the owner.
