---
name: whatsapp-business-platform
description: Use when a question or a task touches Meta's WhatsApp Business Platform (Cloud API, Business Management API, Graph API for WhatsApp) in any project — what the API can read or do, what needs webhooks, sending messages and templates, template rules and limits, analytics and costs, phone number quality and messaging limits, Flows, calling, groups, marketing messages, pricing changes, webhook fields and setup, or what platforms like a shared inbox build on top of it. Answers "can we do X with the WhatsApp API?", "does this need a webhook?", "شو بنقدر نعمل بالواتساب API", "الويب هوك", "القوالب", "حد الرسائل", "التكلفة".
---

# WhatsApp Business Platform

**Read when:** planning or answering anything about the WhatsApp Business APIs.
**Owns:** the capability catalog (checked against Meta's docs 2026-11-03), the webhook-vs-polling
split, and the limits and dates that change designs.

## Answer fast

1. Find the capability in the table below, then open the one reference file it points to.
2. Say clearly whether it works **without webhooks**, **partly** (works, but the result only arrives by
   webhook) or **needs webhooks**.
3. Facts change often. For anything you will build on, re-check the doc page: append `.md` to any page
   under `https://developers.facebook.com/documentation/business-messaging/whatsapp/` for a short
   version, and `…/whatsapp/llms.txt` lists every page. The main changelog stops at 2026-05-12; later
   changes live on topic pages and in their own changelogs (Marketing Messages API, BSUIDs, Flows,
   Calling) (checked 2026-11-03).
4. Current Graph API version: v26.0, released 2026-07-29; v25.0 expires 2028-07-29 (checked 2026-11-03).

## The five facts that decide most designs

1. **No message history API.** You cannot list sent messages, read a message's status later, list
   conversations or customers, or fetch inbound messages. Statuses and replies arrive only by webhook,
   and "there are no APIs for fetching historical webhook data" — store each event on arrival.
2. **Without webhooks you still get a lot:** account and number health, quality, limits, templates
   (full CRUD, library, comparison/block rate, archive, unpause, migrate), analytics (all traffic,
   per-template, cost by country/number/category/free-vs-paid/tier), business profile, QR codes, block
   list, ice breakers, Flows management, and an activity log (`GET /{WABA}/activities`).
3. **One webhook URL per Meta app.** Overrides move `messages`/calls/groups per WABA or number, but
   template and account events always go to the app default. Taking over an app another system uses
   steals its messages; a second app on the same WABA is the safer route (not confirmed by the docs —
   test first), or forward from the system that already receives them.
4. **Pricing (per delivered message since 2025-07-01):** from 2026-10-01 service messages and in-window
   utility messages are charged, with 1,000 free service messages per number per month; without a
   payment method, service messages stop after the free tier (checked 2026-11-03).
   **Marketing on Cloud API ends 2027-10-13** (new WABAs from 2027-04-13 can't send it); marketing moves
   to the Marketing Messages API (checked 2026-11-03).
5. **Deprecated fields to avoid:** `messaging_limit_tier` → use
   `whatsapp_business_manager_messaging_limit` (limits are per business portfolio since 2025-10-07);
   `conversation_analytics` → `pricing_analytics`; Flows Metrics API (2026-04-30); `billable` in status
   pricing → use `pricing.type` + `pricing.category`; the two-step PIN is being phased out for eligible
   numbers (checked 2026-11-03).

## Where each topic lives

| Topic | File |
|---|---|
| WABA and portfolio fields, health status, activity log, users, credit line; phone numbers (fields, register, PIN, display name, OBA, username, settings); business profile; analytics (`analytics`, `pricing_analytics`, `template_analytics`, template comparison, calls, groups); templates (list, create, edit, delete, archive, unpause, library, migrate, groups); what no API gives | [references/management-and-analytics.md](references/management-and-analytics.md) |
| Sending: the 24-hour window, every message type, media, template types (authentication, coupon, limited-time offer, carousel), TTL, throughput, Flows, Marketing Messages API, Calling, Groups, commerce and payments, QR codes, block users, ice breakers, BSUIDs and usernames | [references/sending-and-features.md](references/sending-and-features.md) |
| Webhooks: every field and the feature it enables, inbound message types, statuses with pricing and errors, setup (verify, signature, retries, overrides, mTLS), data only webhooks give | [references/webhooks.md](references/webhooks.md) |
| What a WhatsApp inbox/CRM platform builds on these APIs, and how each feature maps to "no webhook / needs webhook" | [references/platforms.md](references/platforms.md) |

## Safety when testing against a real account

- Read calls are safe. Creating, editing or deleting templates, sending messages, changing the profile,
  registering numbers, turning on insights (`is_enabled_for_insights` is irreversible) all change a live
  business account: do them only when the user asks for that action.
- Never print or commit access tokens; use demo data in screenshots.
