# Sending and customer-facing features

Researched from Meta's docs on 2026-10-27, key facts re-checked 2026-11-03 (v26.0 is the newest Graph API
version). Doc paths are relative to
`https://developers.facebook.com/documentation/business-messaging/whatsapp/`. PNID = phone number id.
"Partly" means the call works without webhooks but its outcome arrives only by webhook.

## The rules every send obeys

- `POST /{PNID}/messages` returns only the message id (wamid): "does not indicate successful delivery". There is
  no endpoint to read a message's status later.
- **24-hour window:** free-form (service) messages only within 24 h of the user's last message or call;
  otherwise templates only. Without webhooks you cannot know when the window is open, so only templates are
  reliable.
- Mark-as-read, typing indicator, reacting to or quoting a **user's** message all need that message's wamid,
  which comes from a webhook. Quoting your own sent message works (the send response gives its wamid).
- **Pricing** (pricing, checked 2026-11-03): per delivered message since 2025-07-01, by category and the
  recipient's country code; messages from users are free. Template categories marketing, utility,
  authentication (authentication-international rates in 18 markets, 9 of them added 2026-10-01); non-template
  categories service and Meta Business Agent (from 2026-07-01, billed per token, no free messages or tiers).
  From 2026-10-01 service messages and in-window utility messages are charged, with 1,000 free service
  messages per number per month (no rollover, resets at midnight in the account's timezone); without a
  payment method service messages stop delivering after the free tier. Free entry point window: up to 7 days
  after a user messages from a click-to-WhatsApp ad. Volume tiers for utility and authentication, per market,
  summed across the portfolio, reset monthly. Eligible government and non-profit organizations keep free
  service messages until 2027-12-31 (`pricing.subtype: paid_exempt`, `service_pricing_policy: PAID_EXEMPT`).
  Meta changes prices only on Jan 1, Apr 1, Jul 1 or Oct 1.
- **Marketing on Cloud API ends:** "Cloud API will stop supporting marketing messages on October 13, 2027"
  (marketing-messages/overview, checked 2026-11-03). WABAs created on or after 2027-04-13 cannot send marketing
  on Cloud API at all. Marketing moves to the Marketing Messages API (below). Since 2026-04-06 a business
  can turn off marketing on Cloud API early; marketing templates sent there then fail with 131063.
- **Throughput** (throughput, checked 2026-11-03): 80 messages/s per number by default; automatic upgrade to
  1,000/s when the portfolio is unlimited, the number reached 100K unique users outside the window in 24 h,
  and its quality is YELLOW or better; coexistence numbers fixed at 20/s. Pair limit to one user: about
  1 message per 6 s, burst 45 (checked 2026-10-27; the throughput page no longer states the numbers).
- **Messaging limit:** read `GET /{PNID}?fields=whatsapp_business_manager_messaging_limit`. The old
  `messaging_limit_tier` field "has been deprecated" (messaging-limits, checked 2026-11-03). Tiers 250, 2,000,
  10K, 100K, unlimited, shared per business portfolio since 2025-10-07.
- Marketing templates are not delivered to US (+1) numbers; Meta's per-user marketing cap fails a send with
  131049, reported by webhook.

## Messages API (`POST /{PNID}/messages`)

| Type | Notes | Without webhooks |
|---|---|---|
| text | 4096 chars, `preview_url` | partly |
| image, video, audio, document, sticker | by media id or link (links cached 10 min) | partly |
| voice message | `audio.voice: true`, OGG/OPUS, play icon if ≤ 512 KB; `played` status by webhook | partly |
| location, contacts | ≤ 257 contacts | partly |
| location request | `interactive.type: location_request_message`; location comes back by webhook | partly |
| reaction | `message_id` + `emoji`, target ≤ 30 days old | needs the user's wamid |
| reply buttons, list, CTA URL | ≤ 3 buttons; list ≤ 10 rows/10 sections | partly |
| media carousel (non-template) | 2–10 cards | partly |
| Flow, voice-call button, call permission request | see Flows and Calling | partly |
| address request | India only | partly |
| request contact info | `interactive.type: request_contact_info` (renamed from `contact_request` 2026-05-28), fixed button text (checked 2026-11-03) | partly |
| product, product list (≤ 30), catalog, product carousel | needs a connected catalog; carts arrive as `order` webhooks | partly |
| template | approved template | yes (send) |
| reply-to | `context.message_id`; no quote bubble on templates | own wamids only |
| mark as read | `{status: "read", message_id}`, within 30 days | no |
| typing indicator | same body + `typing_indicator: {type: "text"}`, shows up to 25 s | no |
| Direct Send | `category: "utility"` without a pre-made template; Meta generates it; rolling out to 100K/unlimited portfolios (checked 2026-10-27; no Meta page found 2026-11-03) | partly |
| group send | `recipient_type: group`; `type: pin` for admins | partly |

No endpoint edits or deletes a sent 1:1 message.

## Media API

`POST /{PNID}/media` (multipart `file`, `type`, `messaging_product`), id lasts 30 days ·
`GET /{MEDIA_ID}` gives a URL valid 5 minutes, download it with the bearer token · `DELETE /{MEDIA_ID}`.
Limits: audio 16 MB, documents 100 MB, images 5 MB (JPEG/PNG), video 16 MB (MP4/3GP, H.264 + AAC), stickers
WebP 100 KB static / 500 KB animated. Inbound media ids come from webhooks and last 7 days.

## Template types worth knowing

- **Template library:** `GET /message_template_library?search=…`, create with `library_template_name`;
  UTILITY only.
- **Authentication:** OTP button `copy_code`, `one_tap`, `zero_tap` (Android only for one-tap/zero-tap; the
  PendingIntent handshake was deprecated 2026-10-15, use the OTP SDK). Preview
  `GET /{WABA}/message_template_previews`; bulk `POST /{WABA}/upsert_message_templates`.
- **Marketing:** coupon code (copy-code button, ≤ 20 chars), limited-time offer (`expiration_time_ms` at send,
  no footer), media card carousel (2–10 cards), location header (also utility), product and catalog templates.
- Call permission request component, voice-call button, Flow button; URL title override.
- **Time to live** (templates/time-to-live, checked 2026-11-03): `message_send_ttl_seconds`: authentication
  30 s–15 min (default 10 min), utility 30 s–12 h (default 30 days), marketing 12 h–30 d (Marketing Messages
  API only).

## WhatsApp Flows (forms inside WhatsApp)

`POST /{WABA}/flows` create (DRAFT) · `POST /{FLOW_ID}/assets` upload flow.json (≤ 10 MB, returns
`validation_errors`) · `POST /{FLOW_ID}/publish` / `deprecate` · `DELETE /{FLOW_ID}` (drafts only) ·
`GET /{FLOW_ID}?fields=…,health_status,preview` (preview link lasts 30 days) · `GET /{WABA}/flows` ·
`POST /{DEST_WABA}/migrate_flows`. States DRAFT, PUBLISHED, DEPRECATED, BLOCKED, THROTTLED. Published Flows
cannot be edited. Answers arrive only as `nfm_reply` webhooks. Endpoint-based Flows call your HTTPS server
with encrypted `data_exchange` requests. Recommended versions: Flow JSON 7.3, `data_api_version` 4.0
(flows/changelogs, checked 2026-11-03). The Flows Metrics API was deprecated 2026-04-30 (banner on its page,
checked 2026-11-03); use the `flows` webhook alerts.

## Marketing Messages API for WhatsApp (formerly MM Lite)

- Onboarding is accepted in WhatsApp Manager or the App Dashboard only; check
  `GET /{WABA}?fields=marketing_messages_onboarding_status` (ELIGIBLE, ONBOARDED). GA since 2025-11-19
  (checked 2026-11-03).
- Send `POST /{PNID}/marketing_messages` (marketing templates only; `product_policy` CLOUD_API_FALLBACK or
  STRICT).
- Adds quality-based delivery, GIF headers, Android deep links, TTL, benchmarks, automatic creative
  optimizations (off by default since 2026-04-21), landing page view tracking (`landing_page_view` webhook,
  2026-09-23). Sending to a BSUID via `recipient` since 2026-05-05.
- **Max price per message:** open beta since 2026-10-01, set per template with `optimization_spec` (replaced
  `bid_spec`, unsupported after 2026-07-31); per-country multipliers up to 240 countries per template;
  error 131065 where max price is unavailable (marketing-messages/changelog, checked 2026-11-03).
- **Metrics without webhooks:** `GET /{WABA}/template_analytics?product_type=MARKETING_MESSAGES_LITE_API`
  with SENT, DELIVERED, READ, CLICKED, COST and app/website conversions (needs Pixel or Conversions API).
  Per-click events are webhook-only.

## Calling API

Call settings `GET/POST /{PNID}/settings` (`calling.*`; needs a 2,000+ messaging limit) · permission state
`GET /{PNID}/call_permissions?user_wa_id=` (temporary 7 days or permanent; ≤ 1 request per 24 h, 2 per
7 days) · business-initiated `POST /{PNID}/calls` (`connect` with SDP, `terminate`; not in US, CA, EG, VN, NG)
· user-initiated `pre_accept`/`accept`/`reject` · SIP mode · call buttons and `wa.me/call/` links · recording
and transcription (7 days, via webhook; free for now, pricing planned) · G.711 codec setting (2026-03-23).
Call signalling needs the `calls` webhook or SIP (WebRTC or SDES). User-initiated calls are free;
business-initiated are billed in 6-second pulses by destination and volume tier; 2 unanswered calls in a row
prompt the user to reconsider the permission, 4 revoke it. Video calling is not available yet (calling,
calling/pricing, checked 2026-11-03).

## Groups API

Needs an Official Business Account, a Cloud API number and the four group webhook fields.
`POST /{PNID}/groups` · `GET /{PNID}/groups` · `POST`/`DELETE /{GROUP_ID}` · invite link
`GET/POST /{GROUP_ID}/invite_link` · join requests · remove participants · `GET /{WABA}/group_analytics`.
8 participants per group, 10,000 groups per number, invite only; text, media and text/media templates only;
no interactive, commerce, auth, calling, edit or delete; not for coexistence numbers. Charged per message
(`group_marketing`, `group_utility`, `group_service`) (groups, checked 2026-11-03).

## Commerce and payments

- Catalog `GET/POST /{WABA}/product_catalogs` (one per WABA) · cart and catalog visibility
  `GET/POST /{PNID}/whatsapp_commerce_settings`.
- Payments India: payment configurations, `order_details` invoices, synchronous lookup
  `GET /{PNID}/payments/{config}/{reference_id}`, refunds. Brazil: Pix, boleto, payment links, cards via
  `order_details`. Singapore removed 2025-03-31.

## Account-side features a business uses daily

| Feature | Call | Without webhooks |
|---|---|---|
| Ice breakers and commands | `POST /{PNID}/conversational_automation`; read `GET /{PNID}?fields=conversational_automation` (≤ 4 prompts × 80 chars, ≤ 30 commands) | yes (taps arrive as messages) |
| QR codes and short links | `POST/GET /{PNID}/message_qrdls`, `GET/DELETE …/{code}`; prefilled text ≤ 140 chars, ≤ 2,000 per number, SVG/PNG, no analytics | yes |
| Block users | `POST/DELETE/GET /{PNID}/block_users`; only users who wrote in the last 24 h; ≤ 1,000 per call, 64,000 max | yes |
| Business profile | `GET/POST /{PNID}/whatsapp_business_profile` (about, address ≤ 256, description, email, websites, vertical, photo) | yes |
| Official Business Account (green badge) status | `GET /{PNID}?fields=official_business_account`; request in WhatsApp Manager | yes |
| Usernames | `POST/GET/DELETE /{PNID}/username`, `GET /{PNID}/username_suggestions`; 2 changes per 14 days | yes |
| Contact book check | `GET /{PNID}/contact_book?bsuid=` (never returns a phone number) | yes |
| Welcome message sequences for click-to-WhatsApp ads | `POST/GET/DELETE /{WABA}/welcome_message_sequences` | yes |

Business-scoped user ids (BSUID, business-scoped-user-ids, checked 2026-11-03): in webhooks since early April
2026; sending to `recipient` = BSUID from July 2026 (Marketing Messages API since 2026-05-05). Businesses can
reserve usernames since 2026-06-29; consumer usernames roll out gradually, and when a user adopts one their
phone number is usually left out of webhooks, so key customers by BSUID, not phone. No phone-to-BSUID lookup
exists. Marketing opt-outs have no read API (webhook `user_preferences` only).

UNVERIFIED (pages missing or unclear): welcome message (`enable_welcome_message`), the OBA request API path,
booking and location-request templates, video calling, Mexico payments, whether error 131047 (window closed)
comes back in the send response.
