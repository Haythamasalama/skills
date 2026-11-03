# Shared-inbox and CRM platform checklist

**Read when:** designing, building or evaluating a product that lets a team run WhatsApp conversations
(shared inbox, CRM, campaigns, chatbot) on top of Meta's APIs.
**Owns:** the checklist of features such a product needs, each mapped to the Meta capability behind it
and to whether it needs webhooks.

**TL;DR**
- Almost everything that makes such a product useful (inbox, per-recipient results, replies, routing,
  response times) rests on receiving and storing webhooks: the product must be the app subscribed to the
  number.
- Account management, templates and cost reports work by polling.
- Meta gives no conversation list or history: the product's own store is the source of truth.

Calls and limits are in the other references of this skill: account-and-templates.md, sending.md,
analytics-and-pricing.md, webhooks.md.

## Features, mapped to Meta capabilities

| Feature | What it does | On Meta's side |
|---|---|---|
| Shared inbox | the team replies from one number; the agent's name beside each reply | needs webhooks (inbound messages + statuses) and stored history; replies only inside the 24-hour window |
| Assignment, tags, response-time targets | route each conversation to a team or agent; report late replies | needs webhooks; the routing logic is the product's own |
| Template builder | variables, phone preview, submit for approval from the same screen | no webhook: `POST /{WABA}/message_templates`; status by polling or the template webhooks |
| Campaigns | one template to a list or segment (e.g. an online store's customers with an open order), scheduled; recipient count and cost before sending; per-recipient delivered/read/failed with reason; replies open in the inbox; cancel before start | sending needs no webhook; per-recipient results and replies need webhooks; cost estimate from Meta's rate card or `pricing_analytics`; respect the messaging limit and marketing opt-outs |
| Account management | edit name, photo and about; show the messaging limit, quality rating and health | no webhook: business profile, `whatsapp_business_manager_messaging_limit`, `quality_rating`, `health_status` |
| Blocked contacts | block a spam number once for the whole team | `block_users` (only users who wrote in the last 24 h) |
| Chatbot flows | welcome reply with buttons, routing by the choice, a different reply outside working hours (e.g. a clinic booking service) | needs webhooks (inbound) + interactive messages or Flows |
| AI agent | answers messages (and calls), hands over to the team | needs webhooks; calls need the `calls` webhook or SIP |
| Reports and satisfaction | volumes, response times, a rating after a chat | from stored webhooks; Meta's `analytics` gives only sent/delivered counts |
| Cost report | spend by country, number, category | no webhook: `pricing_analytics`; per message from status `pricing` |
| Entry points | QR code, website chat button, `wa.me` links | QR codes via `message_qrdls` or plain `wa.me` links; the rest is client-side |
| Customer identity | one contact record per person | key by BSUID: usernames hide phone numbers in webhooks |

## The public API such a product should expose

- OAuth2 client credentials or API keys created by the customer; secret shown once; a per-workspace rate
  limit with HTTP 429 and `Retry-After`.
- Sending: text, template, media, interactive buttons; media upload.
- Conversations: list, get one, assign to a user or team, tag, and a **timeline** that returns every
  message (and call) in order with direction, status, error code and reason, body, attachment, reply-to
  and reactions. Why: Meta has no such endpoint, so this exists only because the product stored the
  webhooks.
- Contacts with custom properties, imports and history; tags; teams.
- Outbound webhooks per channel, signed with HMAC-SHA256 in a header, with ids for the conversation,
  contact and message, plus direction, type, body, media URL, status, cost category and error.

## Connecting a number another product already serves

Follow webhooks.md, "One callback URL per app", before changing any subscription: the wrong route
silently cuts the other product off from its messages.
