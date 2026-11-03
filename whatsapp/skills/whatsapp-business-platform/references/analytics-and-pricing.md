# Analytics, pricing, messaging limits and throughput

**Read when:** reporting on volume or cost, estimating what a send will cost, or planning how many
messages a number can send and how fast.
**Owns:** every analytics endpoint, the pricing model and its dates, messaging limits, throughput, and
the credit line.

**TL;DR**
- All analytics are polling; lookback is 1 year for traffic and cost, 90 days for templates and groups.
- Billing is per delivered message by category and recipient country. From 2026-10-01 service and
  in-window utility messages are charged beyond 1,000 free service messages per number per month.
- The messaging limit is per business portfolio (since 2025-10-07): read
  `whatsapp_business_manager_messaging_limit`, never `messaging_limit_tier`.
- Throughput is 80 messages/s per number by default; about 1 message per 6 s to the same user.

Host `graph.facebook.com/v26.0`. `D/` = `https://developers.facebook.com/documentation/business-messaging/whatsapp/`.
PNID = phone number id. Permission `whatsapp_business_management`; `business_management` for
portfolio-level fields and credit lines.

## Analytics (all polling)

Fields on `GET /{WABA}?fields=X.start(unix).end(unix).granularity(...)` unless a path is shown. Lookback is
**1 year** since 2025-12-01 for analytics, conversation_analytics, pricing_analytics; 90 days for template
and group analytics.

| Metric | Call | Notes |
|---|---|---|
| All traffic | `analytics`: HALF_HOUR/DAY/MONTH; filter phone_numbers, country_codes, `product_types` (0 template, 2 non-template, 100 incoming) → sent, delivered | covers service replies and incoming too, not only templates |
| Cost | `pricing_analytics`: HALF_HOUR/DAILY/MONTHLY; metric COST, VOLUME; `dimensions` COUNTRY, PHONE, PRICING_CATEGORY, PRICING_TYPE, TIER; pricing_types FREE_CUSTOMER_SERVICE, FREE_ENTRY_POINT, REGULAR | TIER is the only source of volume-tier progress; SERVICE/UTILITY meanings changed 2026-10-01 |
| Conversations (legacy) | `conversation_analytics` | conversation pricing ended 2025-07-01 |
| Per template | `GET /{WABA}/template_analytics?template_ids=[≤10]&metric_types=SENT,DELIVERED,READ,CLICKED,COST&granularity=DAILY` (+ `product_type`, `use_waba_timezone`) | needs insights on (irreversible); clicks only for MARKETING/UTILITY; read and click counts cover 7 days after send; **not available for EU or Japan** numbers; cost = amount_spent, cost_per_delivered, cost_per_url_button_click |
| Marketing Messages API | `template_analytics` with `product_type=MARKETING_MESSAGES_LITE_API` | adds app and website conversions (needs Pixel or Conversions API); per-click events are webhook-only |
| Template groups | `GET /{WABA}/template_group_analytics?template_group_ids=[≤10]` | |
| **Block rate** | `GET /{TEMPLATE}/compare?template_ids=[other]&start&end` → BLOCK_RATE ranking, MESSAGE_SENDS, TOP_BLOCK_REASON | 2 templates of one WABA, each sent ≥ 1,000 times; windows 7/30/60/90 days (`D/templates/template-comparison`) |
| Calls | `call_analytics`: COUNT, COST, AVERAGE_DURATION by phone/direction/country | |
| Groups | `GET /{WABA}/group_analytics?group_ids=[1]` | |
| Flow endpoint metrics | `GET /{FLOW}?fields=metric.name(...)` | deprecated 2026-04-30 (checked 2026-11-03); use `flows` webhook alerts |

Response times, satisfaction and per-agent numbers do not exist on Meta's side: they come only from
webhooks you stored.

## Pricing (`D/pricing`, checked 2026-11-03)

- Per delivered message since 2025-07-01, by category and the recipient's country code. Messages from
  users are free. Meta changes prices only on Jan 1, Apr 1, Jul 1 or Oct 1.
- Template categories: marketing, utility, authentication (authentication-international rates in 18
  markets, 9 of them added 2026-10-01). Non-template categories: service, and Meta Business Agent (from
  2026-07-01, billed per token, no free messages or tiers).
- **From 2026-10-01** service messages and in-window utility messages are charged, with 1,000 free service
  messages per number per month (no rollover, resets at midnight in the account's timezone). Without a
  payment method (`primary_funding_id` absent), service messages stop delivering after the free tier.
- Free entry point window: up to 7 days after a user messages from a click-to-WhatsApp ad.
- Volume tiers for utility and authentication, per market, summed across the portfolio, reset monthly;
  progress only via the `pricing_analytics` TIER dimension or the `VOLUME_BASED_PRICING_TIER_UPDATE`
  webhook event.
- Eligible government and non-profit organizations keep free service messages until 2027-12-31
  (`pricing.subtype: paid_exempt`, `service_pricing_policy: PAID_EXEMPT`).
- Per-message price and category arrive only in the `pricing` object of status webhooks (webhooks.md).
  A cost estimate before sending comes from Meta's rate card plus the recipient count.
- **Marketing Messages API max price per message:** open beta since 2026-10-01, set per template with
  `optimization_spec` (replaced `bid_spec`, unsupported after 2026-07-31); per-country multipliers for up
  to 240 countries per template; error 131065 where max price is unavailable
  (marketing-messages/changelog, checked 2026-11-03).
- **Calls** (calling/pricing, checked 2026-11-03): user-initiated calls are free; business-initiated calls
  are billed in 6-second pulses by destination and volume tier. Recording and transcription are free for
  now, pricing is planned.
- **Groups** (groups, checked 2026-11-03): charged per message as `group_marketing`, `group_utility`,
  `group_service`.

## Messaging limits (`D/messaging-limits`, checked 2026-11-03)

- Read `GET /{PNID or BIZ}?fields=whatsapp_business_manager_messaging_limit`: TIER_50, TIER_250, TIER_2K,
  TIER_10K, TIER_100K, TIER_UNLIMITED, UNTIERED. The old `messaging_limit_tier` field "has been
  deprecated".
- The limit is shared per business portfolio since 2025-10-07.
- New portfolios start at 250; 2,000 after business verification or after 2,000 delivered template
  messages outside the window in 30 days; then automatic steps within 6 h when quality is high and at
  least half the limit was used in 7 days.
- The FLAGGED quality state no longer exists and quality drops no longer lower the limit.
- Changes arrive on the `phone_number_quality_update` and `business_capability_update` webhooks; polling
  the field works too.
- Some features need a minimum limit: business-initiated calling needs 2,000+.

## Throughput (`D/throughput`, checked 2026-11-03)

- 80 messages/s per number by default; automatic upgrade to 1,000/s when the portfolio is unlimited, the
  number reached 100K unique users outside the window in 24 h, and its quality is YELLOW or better.
  Coexistence numbers are fixed at 20/s. Read the current level with `GET /{PNID}?fields=throughput`.
- Pair limit to one user: about 1 message per 6 s, burst 45 (checked 2026-10-27; the throughput page no
  longer states the numbers).

## Credit line

- `GET /{BIZ}/extendedcredits` (balance, credit_available, max_balance, allocated_amount,
  legal_entity_name, is_access_revoked). There is no balance API for card billing.
