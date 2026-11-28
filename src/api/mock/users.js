import { ApiError } from '../client'
import { wait } from './wait'

// Same shapes as docs/api-contract.md (Users). The list, the filters and the stats work like the server.
// The data is in a variable, so suspend and reactivate change the list and the stats.

const DAY = 24 * 60 * 60 * 1000
const GRACE_DAYS = 3

const PLAN_NAMES = { TRIAL: 'Trial', STARTER: 'Starter', PRO: 'Pro' }

const isoDaysFromNow = (days) => new Date(Date.now() + days * DAY).toISOString()

// Plan of an owner. days = days until the period ends (negative = already ended).
// A PAST_DUE plan has a grace date. The dates follow today, so "2 days left" always looks right.
function plan(code, status, days) {
  return {
    code,
    name: PLAN_NAMES[code],
    status,
    endsAt: isoDaysFromNow(days),
    graceUntil: status === 'PAST_DUE' ? isoDaysFromNow(days + GRACE_DAYS) : null,
  }
}

// created_at goes up with the id, 15 days apart, starting 5 Jan 2025
function user(id, fullName, email, phone, role, trust, extra = {}) {
  const createdAt = new Date(Date.UTC(2025, 0, 5) + id * 15 * DAY).toISOString()
  return {
    id,
    fullName,
    email,
    phone,
    role,
    status: 'ACTIVE',
    trust,
    plan: null,
    billing: null,
    lastLoginAt: new Date(Date.parse(createdAt) + 3 * DAY).toISOString(),
    createdAt,
    ...extra,
  }
}

const users = [
  // Admins: no trust, no plan, no billing
  user(1, 'Pon Somnang', 'pon.somnang@julnow.com', '012100001', 'ADMIN', null),
  user(2, 'Rithy Meas', 'rithy.meas@julnow.com', '012100002', 'ADMIN', null),
  user(3, 'Chantha Rom', 'chantha.rom@julnow.com', null, 'ADMIN', null, { lastLoginAt: null }),

  // Owners: every plan, plan status and billing case
  user(4, 'Sokha Chan', 'sokha.chan@gmail.com', '012345678', 'OWNER', 'VERIFIED', { plan: plan('PRO', 'ACTIVE', 21), billing: 'PAID' }),
  user(5, 'Chenda Lim', 'chenda.lim@gmail.com', '098765432', 'OWNER', 'VERIFIED', { plan: plan('PRO', 'ACTIVE', 9), billing: 'PAID' }),
  user(6, 'Srey Neang Phal', 'sreyneang.p@gmail.com', '081222333', 'OWNER', 'UNVERIFIED', { plan: plan('TRIAL', 'TRIALING', 10) }),
  user(7, 'Visal Heng', 'visal.heng@yahoo.com', '017888999', 'OWNER', 'VERIFIED', { plan: plan('PRO', 'PAST_DUE', -1), billing: 'PAST_DUE' }),
  user(8, 'Bopha Sok', 'bopha.sok@gmail.com', '069111222', 'OWNER', 'VERIFIED', { plan: plan('STARTER', 'EXPIRED', -12), billing: 'FAILED' }),
  user(9, 'Sovann Pich', 'sovann.pich@gmail.com', '093555666', 'OWNER', 'VERIFIED', { plan: plan('STARTER', 'ACTIVE', 17), billing: 'PAID' }),
  user(10, 'Kosal Tep Chhaiyaroth Panharith', 'kosal.tep.chhaiyaroth.panharith@mail.example.com', '010777888', 'OWNER', 'VERIFIED', { plan: plan('STARTER', 'ACTIVE', 2), billing: 'UNPAID' }),
  user(11, 'Mony Ouk', 'mony.ouk@gmail.com', '085444555', 'OWNER', 'VERIFIED', { plan: plan('TRIAL', 'TRIALING', 3) }),
  user(12, 'Rattanak Vong', 'rattanak.vong@gmail.com', '012666777', 'OWNER', 'FLAGGED', { plan: plan('STARTER', 'PAST_DUE', -2), billing: 'PAST_DUE' }),
  user(13, 'Sreymom Heng', 'sreymom.heng@gmail.com', '096333444', 'OWNER', 'UNVERIFIED', { plan: plan('PRO', 'CANCELLED', 6), billing: 'PAID' }),
  user(14, 'Piseth Nhem', 'piseth.nhem@gmail.com', '015999000', 'OWNER', 'UNVERIFIED', { plan: plan('TRIAL', 'EXPIRED', -5) }),
  user(15, 'Thida Roeun', 'thida.roeun@gmail.com', null, 'OWNER', 'FLAGGED', { status: 'SUSPENDED', plan: plan('STARTER', 'ACTIVE', 12), billing: 'PAID' }),

  // Tenants: no plan, no billing
  user(16, 'Dara Kim', 'dara.kim@outlook.com', '012300100', 'TENANT', 'FLAGGED', { status: 'SUSPENDED' }),
  user(17, 'Sophea Lim', 'sophea.lim@gmail.com', '012300101', 'TENANT', 'VERIFIED'),
  user(18, 'Vannak Chea', 'vannak.chea@gmail.com', '012300102', 'TENANT', 'VERIFIED'),
  user(19, 'Srey Pov', 'srey.pov@gmail.com', null, 'TENANT', 'UNVERIFIED'),
  user(20, 'Kimleng Sok', 'kimleng.sok@yahoo.com', '012300104', 'TENANT', 'VERIFIED'),
  user(21, 'Sreyleak Ouch', 'sreyleak.ouch@gmail.com', '012300105', 'TENANT', 'VERIFIED'),
  user(22, 'Borey Meas', 'borey.meas@gmail.com', '012300106', 'TENANT', 'FLAGGED'),
  user(23, 'Chantrea Keo', 'chantrea.keo@gmail.com', '012300107', 'TENANT', 'VERIFIED'),
  user(24, 'Veasna Phan', 'veasna.phan@gmail.com', '012300108', 'TENANT', 'UNVERIFIED', { lastLoginAt: null }),
  user(25, 'Malis Chhun', 'malis.chhun@gmail.com', '012300109', 'TENANT', 'VERIFIED'),
  user(26, 'Rotha Sem', 'rotha.sem@gmail.com', '012300110', 'TENANT', 'VERIFIED'),
  user(27, 'Sokunthea Yim', 'sokunthea.yim@gmail.com', null, 'TENANT', 'UNVERIFIED'),
  user(28, 'Ratha Lay', 'ratha.lay@gmail.com', '012300112', 'TENANT', 'VERIFIED', { status: 'SUSPENDED' }),
  user(29, 'Bunthoeun Kao', 'bunthoeun.kao@gmail.com', '012300113', 'TENANT', 'VERIFIED'),
  user(30, 'Channary Hor', 'channary.hor@gmail.com', '012300114', 'TENANT', 'VERIFIED'),
  user(31, 'Vuthy Ang', 'vuthy.ang@gmail.com', '012300115', 'TENANT', 'UNVERIFIED'),
  user(32, 'Nimol Chum', 'nimol.chum@gmail.com', '012300116', 'TENANT', 'VERIFIED'),
  user(33, 'Sreypich Tan', 'sreypich.tan@gmail.com', '012300117', 'TENANT', 'VERIFIED'),
  user(34, 'Pheakdey Mao', 'pheakdey.mao@gmail.com', '012300118', 'TENANT', 'VERIFIED', { status: 'SUSPENDED' }),
  user(35, 'Davin Noun', 'davin.noun@gmail.com', '012300119', 'TENANT', 'VERIFIED'),
  user(36, 'Kunthea Sao', 'kunthea.sao@gmail.com', null, 'TENANT', 'UNVERIFIED'),
  user(37, 'Somaly Prak', 'somaly.prak@gmail.com', '012300121', 'TENANT', 'VERIFIED'),
  user(38, 'Sambath Uk', 'sambath.uk@gmail.com', '012300122', 'TENANT', 'VERIFIED'),
  user(39, 'Leakhena Doeur', 'leakhena.doeur@gmail.com', '012300123', 'TENANT', 'VERIFIED'),
  user(40, 'Seyha Men', 'seyha.men@gmail.com', '012300124', 'TENANT', 'VERIFIED'),

  // Never in the list or in the numbers
  user(41, 'Deleted Account', 'deleted.account@example.com', null, 'TENANT', 'UNVERIFIED', { status: 'DELETED' }),
]

// DELETED users are not shown anywhere
const visible = () => users.filter((item) => item.status !== 'DELETED')

export async function getUsersMock({ page = 0, size = 10, q = '', role, status, trust, plan: planCode, billing } = {}) {
  await wait()

  const text = q.trim().toLowerCase()
  const matches = visible()
    .filter((item) => !text || item.fullName.toLowerCase().includes(text) || item.email.toLowerCase().includes(text))
    .filter((item) => !role || item.role === role)
    .filter((item) => !status || item.status === status)
    .filter((item) => !trust || item.trust === trust)
    .filter((item) => !planCode || (planCode === 'NONE' ? item.plan === null : item.plan?.code === planCode))
    .filter((item) => !billing || item.billing === billing)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return {
    items: structuredClone(matches.slice(page * size, (page + 1) * size)),
    page,
    size,
    totalItems: matches.length,
    totalPages: Math.ceil(matches.length / size),
  }
}

const countBy = (test) => visible().filter(test).length

export async function getUserStatsMock() {
  await wait()
  return {
    asOf: new Date().toISOString(),
    totalUsers: { value: visible().length, change: 8.2 },
    tenants: { value: countBy((item) => item.role === 'TENANT'), change: 7.9 },
    owners: { value: countBy((item) => item.role === 'OWNER'), change: 9.6 },
    paidSubscriptions: {
      value: countBy((item) => item.plan?.status === 'ACTIVE'),
      change: 8.7,
      onTrial: countBy((item) => item.plan?.status === 'TRIALING'),
    },
    lateOwners: { value: countBy((item) => item.plan?.status === 'PAST_DUE'), graceDays: GRACE_DAYS },
    suspendedUsers: countBy((item) => item.status === 'SUSPENDED'),
  }
}

export async function setUserStatusMock(id, { status, reason }) {
  await wait()

  const target = visible().find((item) => item.id === id)
  if (!target) throw new ApiError({ status: 404, code: 'USER_NOT_FOUND', detail: 'User not found.' })
  if (target.role === 'ADMIN') throw new ApiError({ status: 403, code: 'FORBIDDEN', detail: 'Admins cannot be suspended here.' })
  if (status !== 'ACTIVE' && status !== 'SUSPENDED') {
    throw new ApiError({ status: 400, code: 'STATUS_INVALID', detail: 'Status must be ACTIVE or SUSPENDED.' })
  }
  if (status === 'SUSPENDED' && !reason?.trim()) {
    throw new ApiError({ status: 400, code: 'REASON_REQUIRED', detail: 'A reason is required to suspend a user.' })
  }

  target.status = status
  return structuredClone(target)
}
