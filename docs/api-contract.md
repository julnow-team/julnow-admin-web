# Admin API contract (draft)

The Admin web is built first with mock data. This file is the agreement between the web and the backend.
The mock files in `src/api/mock/` must return exactly these shapes. Backend builds the endpoints from this file.
If a shape changes, change this file, the mock and the page in the same PR.

## Rules for every endpoint

- Called through the Gateway (`VITE_API_URL`), path starts with `/api/admin/...`
- Header `Authorization: Bearer <access token>`. The Gateway checks the JWT and the ADMIN role.
- JSON field names are camelCase. Dates are ISO text (`2026-12-01T08:30:00Z`). Money is a number in USD.
- Fixed values use the same text as the database CHECK (`ACTIVE`, `PENDING_REVIEW`).
- List endpoints take `page` (starts at 0), `size` and return `{ items, page, size, totalItems, totalPages }`.
- Errors return `{ "detail": "message" }` with status 400, 401, 403, 404 or 409. The web shows `detail`.

## Status

| Endpoint | Web task | Mock | Backend |
|---|---|---|---|
| GET /api/admin/overview | T50 | done | not started |
| GET /api/admin/me | T20 | done (`navigation.js`) | not started |
| GET /api/admin/nav-counts | T20 | done (`navigation.js`) | not started |
| POST /api/admin/auth/login | T21 | todo | not started |
| POST /api/admin/auth/mfa | T21 | todo | not started |
| GET /api/admin/users | T37 | todo | not started |
| PATCH /api/admin/users/{id}/status | T37 | todo | not started |
| GET /api/admin/listings | T38 | todo | not started |
| POST /api/admin/listings/{id}/moderation | T38 | todo | not started |

## Overview

`GET /api/admin/overview`. Data comes from three services (auth, listing, booking), so one service
or the Gateway must collect it. The web calls only this endpoint.

```json
{
  "monthlyRevenue": { "value": 12480, "change": 12.5 },
  "paidSubscriptions": { "value": 312, "change": 8.2, "onTrial": 48 },
  "activeListings": { "value": 1284, "change": 5.1 },
  "totalUsers": { "value": 8923, "change": 3.4 },
  "attention": {
    "lateOwners": 12,
    "flaggedToday": 7,
    "newToday": 26,
    "openCases": 34,
    "casesFromUsers": 21,
    "casesFromSystem": 13
  }
}
```

`change` is the percent against last month. `lateOwners` counts subscriptions with `grace_until` not passed.

## Current admin and sidebar counts

`GET /api/admin/me` returns `{ "fullName": "Pon Somnang", "roleName": "Super admin" }`
(`users.full_name` and `admin_roles.name`).

`GET /api/admin/nav-counts` returns `{ "flaggedListings": 7, "openCases": 34 }`.

## Login and MFA (T21)

`POST /api/admin/auth/login` with `{ "email", "password" }` returns `{ "mfaToken" }` and sends an OTP
(`otp_codes.purpose = ADMIN_MFA`).

`POST /api/admin/auth/mfa` with `{ "mfaToken", "code" }` returns `{ "accessToken", "admin": { ... } }`.
The access token stays in memory only.

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
Backend writes one row in `audit_logs`.

## Listings (T38)

`GET /api/admin/listings?page=0&size=10&q=&status=PENDING_REVIEW&flagged=true`

```json
{
  "items": [
    {
      "id": 31,
      "title": "Studio near AEON Mall",
      "category": "RENTAL",
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

`status`: PENDING_REVIEW, ACTIVE, CHANGES_REQUESTED, REJECTED, PAUSED.
`flags` values: DUPLICATE_PHOTOS, PRICE_TOO_HIGH, BANNED_PHONE (only flags not yet resolved).

`POST /api/admin/listings/{id}/moderation` with `{ "action": "APPROVE" }` or
`{ "action": "REQUEST_CHANGES", "reason": "..." }` or `{ "action": "REJECT", "reason": "..." }`.
Reason is required for REQUEST_CHANGES and REJECT. Returns the updated listing.
Backend writes `moderation_logs` and sends a notification to the owner.
