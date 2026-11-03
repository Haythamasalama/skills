# Sending messages and customer-facing features

**Read when:** sending any message, or building Flows, marketing sends, calling, groups or commerce.
**Owns:** the send rules (24-hour window, wamids), every message type, the Media API, WhatsApp Flows, the
Marketing Messages API and the end of marketing on Cloud API, Calling, Groups, commerce and payments,
and BSUIDs.

**TL;DR**
- A send returns only a message id; delivery, read and failure arrive by webhook.
- Free-form messages only within 24 h of the user's last message or call; otherwise templates only.
- Marketing on Cloud API ends 2027-10-13; new WABAs from 2027-04-13 cannot send it there at all.
- Key customers by BSUID, not phone number: usernames hide the number.

Host `graph.facebook.com/v26.0`. Doc paths are relative to
`https://developers.facebook.com/documentation/business-messaging/whatsapp/`. PNID = phone number id.
"Partly" means the call works without webhooks but its outcome arrives only by webhook. Costs of each
message type: analytics-and-pricing.md.

## The rules every send obeys

- `POST /{PNID}/messages` returns only the message id (wamid): "does not indicate successful delivery".
  There is no endpoint to read a message's status later.
- **24-hour window:** free-form (service) messages only within 24 h of the user's last message or call;
  otherwise templates only. Without webhooks you cannot know when the window is open, so only templates
  are reliable.
- Mark-as-read, typing indicator, reacting to or quoting a **user's** message all need that message's
  wamid, which comes from a webhook. Quoting your own sent message works (the send response gives its
  wamid).
- Marketing templates are not delivered to US (+1) numbers. Meta's per-user marketing cap fails a send
  with 131049, reported by webhook.
- Sends are bounded by the messaging limit and throughput (analytics-and-pricing.md).

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
| template | approved template (types and TTL: account-and-templates.md) | yes (send) |
| reply-to | `context.message_id`; no quote bubble on templates | own wamids only |
| mark as read | `{status: "read", message_id}`, within 30 days | no |
| typing indicator | same body + `typing_indicator: {type: "text"}`, shows up to 25 s | no |
| Direct Send | `category: "utility"` without a pre-made template; Meta generates it; rolling out to 100K/unlimited portfolios (checked 2026-10-27; no Meta page found 2026-11-03) | partly |
| group send | `recipient_type: group`; `type: pin` for admins | partly |

No endpoint edits or deletes a sent 1:1 message.

## Media API

`POST /{PNID}/media` (multipart `file`, `type`, `messaging_product`), id lasts 30 days ·
`GET /{MEDIA_ID}` gives a URL valid 5 minutes, download it with the bearer token · `DELETE /{MEDIA_ID}`.
Limits: audio 16 MB, documents 100 MB, images 5 MB (JPEG/PNG), video 16 MB (MP4/3GP, H.264 + AAC),
stickers WebP 100 KB static / 500 KB animated. Inbound media ids come from webhooks and last 7 days.

## WhatsApp Flows (forms inside WhatsApp)

`POST /{WABA}/flows` create (DRAFT) · `POST /{FLOW_ID}/assets` upload flow.json (≤ 10 MB, returns
`validation_errors`) · `POST /{FLOW_ID}/publish` / `deprecate` · `DELETE /{FLOW_ID}` (drafts only) ·
`GET /{FLOW_ID}?fields=…,health_status,preview` (preview link lasts 30 days) · `GET /{WABA}/flows` ·
`POST /{DEST_WABA}/migrate_flows`.
- States DRAFT, PUBLISHED, DEPRECATED, BLOCKED, THROTTLED. Published Flows cannot be edited.
- Answers arrive only as `nfm_reply` webhooks. Endpoint-based Flows call your HTTPS server with encrypted
  `data_exchange` requests (for example a clinic booking service returning free slots).
- Recommended versions: Flow JSON 7.3, `data_api_version` 4.0 (flows/changelogs, checked 2026-11-03).
- Health: the `flows` webhook alerts (the Flows Metrics API is deprecated, see analytics-and-pricing.md).

## Marketing Messages API for WhatsApp (formerly MM Lite)

- **Marketing leaves Cloud API:** "Cloud API will stop supporting marketing messages on October 13, 2027"
  (marketing-messages/overview, checked 2026-11-03). WABAs created on or after 2027-04-13 cannot send
  marketing on Cloud API at all. Since 2026-04-06 a business can turn off marketing on Cloud API early;
  marketing templates sent there then fail with 131063.
- Onboarding is accepted in WhatsApp Manager or the App Dashboard only; check
  `GET /{WABA}?fields=marketing_messages_onboarding_status` (ELIGIBLE, ONBOARDED). GA since 2025-11-19
  (checked 2026-11-03).
- Send `POST /{PNID}/marketing_messages` (marketing templates only; `product_policy` CLOUD_API_FALLBACK or
  STRICT). Sending to a BSUID via `recipient` since 2026-05-05.
- Adds quality-based delivery, GIF headers, Android deep links, TTL, benchmarks, automatic creative
  optimizations (off by default since 2026-04-21), landing page view tracking (`landing_page_view`
  webhook, 2026-09-23).
- Max price per message and metrics: analytics-and-pricing.md. Per-click events are webhook-only.

## Calling API

- Call settings `GET/POST /{PNID}/settings` (`calling.*`; needs a 2,000+ messaging limit).
- Permission state `GET /{PNID}/call_permissions?user_wa_id=` (temporary 7 days or permanent; ≤ 1 request
  per 24 h, 2 per 7 days). 2 unanswered calls in a row prompt the user to reconsider the permission, 4
  revoke it.
- Business-initiated `POST /{PNID}/calls` (`connect` with SDP, `terminate`; not in US, CA, EG, VN, NG);
  user-initiated `pre_accept`/`accept`/`reject`; SIP mode; call buttons and `wa.me/call/` links.
- Recording and transcription kept 7 days, delivered by webhook. G.711 codec setting (2026-03-23).
- Call signalling needs the `calls` webhook or SIP (WebRTC or SDES).
- Video calling is not available yet (calling, checked 2026-11-03). Call costs: analytics-and-pricing.md.

## Groups API

Needs an Official Business Account, a Cloud API number and the four group webhook fields.
`POST /{PNID}/groups` · `GET /{PNID}/groups` · `POST`/`DELETE /{GROUP_ID}` · invite link
`GET/POST /{GROUP_ID}/invite_link` · join requests · remove participants · analytics in
analytics-and-pricing.md. 8 participants per group, 10,000 groups per number, invite only; text, media
and text/media templates only; no interactive, commerce, auth, calling, edit or delete; not for
coexistence numbers (groups, checked 2026-11-03).

## Commerce and payments

- Catalog `GET/POST /{WABA}/product_catalogs` (one per WABA) · cart and catalog visibility
  `GET/POST /{PNID}/whatsapp_commerce_settings`. Carts arrive as `order` webhooks without a total.
- Payments India: payment configurations, `order_details` invoices, synchronous lookup
  `GET /{PNID}/payments/{config}/{reference_id}`, refunds. Brazil: Pix, boleto, payment links, cards via
  `order_details`. Singapore removed 2025-03-31. Mexico payments: UNVERIFIED.

## Business-scoped user ids (BSUIDs)

business-scoped-user-ids, checked 2026-11-03:
- In webhooks since early April 2026 (`user_id`, `from_user_id`, `recipient_user_id`); sending to
  `recipient` = BSUID from July 2026 (Marketing Messages API since 2026-05-05).
- Consumer usernames roll out gradually; when a user adopts one, their phone number is usually left out
  of webhooks. Why it matters: key customers by BSUID, not phone, or the same customer splits in two.
- No phone-to-BSUID lookup exists; `contact_book?bsuid=` answers only yes/no. How BSUID changes arrive:
  webhooks.md.
- Marketing opt-outs have no read API (`user_preferences` webhook only).

## UNVERIFIED

Pages missing or unclear: whether error 131047 (window closed) comes back in the send response.
