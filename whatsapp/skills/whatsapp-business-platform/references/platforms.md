# What platforms build on the WhatsApp APIs

A real reference product, looked at on 2026-10-27: **Hatif** (hatif.io, API at docs.hatif.io, backend host
`api.voxa.sa`), a Saudi "business phone" — one company number for calls and WhatsApp, answered by the whole
team from one app, with every conversation stored. Use it as a checklist of what customers expect, and of
which features need webhooks.

## Its WhatsApp features, mapped to Meta capabilities

| Feature | What it does | On Meta's side |
|---|---|---|
| Shared inbox | the team replies from one number; the sender's name beside each reply | needs webhooks (inbound messages + statuses) and stored history |
| Auto-assignment, tags, SLA reports | routes each conversation to a team or agent; response-time targets; late-reply report | needs webhooks; logic is the platform's own |
| Template builder | build with variables, phone preview, submit for approval from the same screen | no webhook: `POST /{WABA}/message_templates`; status by polling or the template webhook |
| Campaigns | one template to a list or segment (e.g. "not contacted in 30 days"), scheduled; shows recipient count and cost before sending; warns if the balance does not cover everyone; per-recipient delivered/read/failed with reason; replies open in the inbox; export the log; edit or cancel before start | sending needs no webhook; per-recipient results and replies need webhooks; cost estimate from Meta's rate card / `pricing_analytics` |
| Account management | edit name, photo, about; track the daily messaging limit and Meta's quality rating | no webhook: business profile, `whatsapp_business_manager_messaging_limit`, `quality_rating` |
| Blocked contacts | block a spam number once for the whole team | `block_users` API (only users who wrote in the last 24 h) |
| Chatbot flows | welcome reply with buttons, routes by the choice; different reply outside working hours; no code | needs webhooks (inbound) + interactive messages |
| AI agent | answers calls and WhatsApp, hands over to the team | needs webhooks |
| Analytics, CSAT | numbers for calls, WhatsApp and the team; satisfaction rating after a chat | platform data from stored webhooks; Meta's `analytics` covers only sent/delivered counts |
| Free tools | WhatsApp QR code, chat button for a website, text formatter, template checker, number country lookup | QR codes via `message_qrdls` or plain `wa.me` links; the rest is client-side |

## Its public API (what a platform exposes to customers)

- OAuth2 client credentials (token URL `https://api.voxa.sa/connect/token`); credentials created by the
  customer in settings; secret shown once. Rate limit 120 requests/minute per workspace (HTTP 429 with
  `Retry-After`).
- Sending: text, template, image, audio, video, file, interactive buttons; media upload.
- **Conversations:** list conversations, get one, assign to a user or team, tag; **conversation timeline**
  (`GET /v2/conversations/service-account/{conversationId}/timeline`) returns every call, WhatsApp
  message and reassignment in order, with `direction`, `status` (Sent …), `errorCode`, `failureReason`,
  `body`, `attachment`, `replyTo`, `reactions`, `aiSummary`, `csatRating`.
- Contacts with custom properties, bulk vCard import, contact history; tags; teams; tasks (projects,
  sections, comments, reminders); outbound IVR calls.
- Outbound webhooks per channel (calls and WhatsApp), signed with HMAC-SHA256 in `X-Voxa-Signature`;
  the WhatsApp payload has `conversationId`, `contactId`, `messageId`, `direction`, `messageType`, `body`,
  `mediaUrl`, `status`, `isBillable`, `errorCode`, `errorReason`.

## The lesson

Everything that makes such a product valuable (inbox, per-recipient campaign results, replies, routing,
SLA) rests on receiving and storing Meta's webhooks — the platform is the app subscribed to the number.
If a business already uses such a platform, the quickest way to show its messages elsewhere is the
platform's own API (e.g. the timeline above), not a second Meta app.
