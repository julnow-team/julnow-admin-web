import { wait } from './wait'

// Same shapes as docs/api-contract.md. Numbers come from the Figma Overview screen.

// A longer range gives bigger counts. Only the counts that depend on the range use it.
const RANGE_FACTOR = { '7d': 0.25, '30d': 1, '90d': 3 }

function scale(value, range) {
  return Math.round(value * RANGE_FACTOR[range])
}

export async function getAuthStatsMock(range) {
  await wait()
  return {
    range,
    asOf: '2026-09-30T09:00:00Z',
    totalUsers: { value: 12847, change: 8.2 },
    monthlyRevenue: { value: 42698, change: 11.4 },
    paidSubscriptions: { value: 1818, change: 8.7, onTrial: 94 },
    subscriptionHealth: {
      plans: [
        { code: 'PRO', price: 29, count: 1102 },
        { code: 'STARTER', price: 15, count: 716 },
        { code: 'TRIAL', price: 0, count: 94 },
      ],
      lateOwners: 38,
      renewalsNext7Days: 72,
      trialsEndingNext7Days: 31,
      revenueAtRisk: 850,
    },
    ownerJourney: {
      signups: scale(218, range),
      startedTrial: scale(194, range),
      convertedToPaid: scale(149, range),
    },
    casesFromUsers: 25,
  }
}

export async function getListingStatsMock(range) {
  await wait()
  return {
    range,
    activeListings: { value: 3462, change: 12.5 },
    pausedListings: 142,
    submissions: {
      submitted: 24,
      autoPublished: 17,
      flagged: 7,
      flags: [
        { type: 'DUPLICATE_PHOTOS', count: 3 },
        { type: 'PRICE_TOO_HIGH', count: 2 },
        { type: 'BANNED_PHONE', count: 2 },
      ],
    },
    casesFromSystem: 9,
    publishedFirstListing: scale(161, range),
    riskExceptions: [
      {
        listingId: 48213,
        code: 'JN-48213',
        title: 'Riverside Studio – BKK1',
        categoryCode: 'RENTAL',
        subcategoryCode: 'ROOM',
        level: 'HIGH',
        flags: [{ type: 'DUPLICATE_PHOTOS' }, { type: 'PRICE_TOO_HIGH', percentAboveAverage: 43 }],
      },
      {
        listingId: 48198,
        code: 'JN-48198',
        title: 'Toyota Prius 2012',
        categoryCode: 'TRAVEL',
        subcategoryCode: 'CAR',
        level: 'MEDIUM',
        flags: [{ type: 'PRICE_TOO_HIGH', percentAboveAverage: 41 }],
      },
      // Mock only: a tenant report. The real endpoint does not send this.
      {
        listingId: 48207,
        code: 'JN-48207',
        title: 'Honda Click 125i',
        categoryCode: 'TRAVEL',
        subcategoryCode: 'MOTO',
        level: 'REPORTED',
        flags: [],
      },
      {
        listingId: 48201,
        code: 'JN-48201',
        title: 'Wooden Villa near Pub Street',
        categoryCode: 'STAY',
        subcategoryCode: 'VILLA',
        level: 'HIGH',
        flags: [{ type: 'BANNED_PHONE' }],
      },
    ],
  }
}

export async function getBookingStatsMock(range) {
  await wait()
  return { range, ownersWithFirstBooking: scale(87, range) }
}

// Last 12 months, oldest first. The last month is 11.4% above the one before.
export async function getRevenueSeriesMock() {
  await wait()
  const values = [15700, 17900, 20100, 21300, 23400, 25800, 27600, 29900, 32300, 34400, 38330, 42698]
  const months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']
  return { series: months.map((month, index) => ({ month, value: values[index] })) }
}

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60000).toISOString()
}

export async function getRecentActivityMock() {
  await wait()
  return {
    items: [
      { type: 'BOOKING_CREATED', at: minutesAgo(2), actorName: 'Davicci', listingTitle: 'Phum Baitang Resort', bookingCode: 'KH-230805' },
      { type: 'LISTING_AUTO_PUBLISHED', at: minutesAgo(14), listingTitle: 'Kampot River Bungalow' },
      { type: 'PAYMENT_FAILED', at: minutesAgo(32), actorName: 'Visal Heng', daysLeft: 2 },
      { type: 'PLAN_UPGRADED', at: minutesAgo(60), actorName: 'Sokha Chan', planCode: 'PRO' },
      { type: 'SUBSCRIPTION_RENEWED', at: minutesAgo(180), actorName: 'Chenda Lim', planCode: 'STARTER', amount: 15 },
      { type: 'LISTING_REPORTED', at: minutesAgo(240), listingTitle: 'Toyota Prius 2012' },
    ],
  }
}
