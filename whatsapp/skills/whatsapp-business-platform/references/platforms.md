# What platforms build on the WhatsApp APIs

Shared-inbox, CRM and "business phone" platforms all sit on the same Meta APIs. Use this page as a
checklist of what customers expect from such a product, and of which features need webhooks.

## Common features, mapped to Meta capabilities

| Feature | What it does | On Meta's side |
|---|---|---|
| Shared inbox | the team replies from one number; the sender's name beside each reply | needs webhooks (inbound messages + statuses) and stored history |
| Auto-assignment, tags, SLA reports | routes each conversation to a team or agent; response-time targets; late-reply report | needs webhooks; the logic is the platform's own |
| Template builder | build with variables, phone preview, submit for approval from the same screen | no webhook: `POST /{WABA}/message_templates`; status by polling or the template webhook |
| Campaigns | one template to a list or segment (e.g. "Customers not contacted in 30 days"), scheduled; recipient count and cost before sending; per-recipient delivered/read/failed with reason; replies open in the inbox; cancel before start | sending needs no webhook; per-recipient results and replies need webhooks; cost estimate from Meta's rate card or `pricing_analytics` |
| Account management | edit name, photo, about; show the messaging limit and quality rating | no webhook: business profile, `whatsapp_business_manager_messaging_limit`, `quality_rating`, `health_status` |
| Blocked contacts | block a spam number once for the whole team | `block_users` API (only users who wrote in the last 24 h) |
| Chatbot flows | welcome reply with buttons, routing by the choice, a different reply outside working hours | needs webhooks (inbound) + interactive messages or Flows |
| AI agent | answers messages (and calls), hands over to the team | needs webhooks; calls need the `calls` webhook or SIP |
| Analytics, CSAT | volumes, response times, satisfaction rating after a chat | platform data from stored webhooks; Meta's `analytics` gives only sent/delivered counts |
| Free tools | QR code, website chat button, text formatter, template checker | QR codes via `message_qrdls` or plain `wa.me` links; the rest is client-side |

## The public API such a platform usually exposes

- OAuth2 client credentials or API keys created by the customer; secret shown once; a per-workspace rate
  limit with HTTP 429 and `Retry-After`.
- Sending: text, template, media, interactive buttons; media upload.
- Conversations: list, get one, assign to a user or team, tag, and a **timeline** that returns every
  message (and call) in order with direction, status, error code and reason, body, attachment, reply-to
  and reactions. This only exists because the platform stored Meta's webhooks.
- Contacts with custom properties, imports and history; tags; teams.
- Outbound webhooks per channel, signed with HMAC-SHA256 in a header, with ids for the conversation,
  contact and message, plus direction, type, body, media URL, status, billable flag and error.

## The lesson

Everything that makes such a product valuable (inbox, per-recipient campaign results, replies, routing,
SLA) rests on receiving and storing Meta's webhooks: the platform is the app subscribed to the number.
If a business already uses such a platform, the quickest way to show its messages elsewhere is the
platform's own API (its conversation timeline), not a second Meta app.
