---
name: whatsapp-business-manager
description: Use when a question or a task touches Meta's WhatsApp Business Platform (Cloud API, Business Management API, Graph API for WhatsApp) in any project — what the API can read or do, what needs webhooks, sending messages and templates, template rules and limits, analytics and costs, phone number quality and messaging limits, Flows, calling, groups, marketing messages, pricing changes, webhook fields and setup, or what a shared-inbox or CRM product built on the API needs. Answers "can we do X with the WhatsApp API?", "does this need a webhook?", "شو بنقدر نعمل بالواتساب API", "الويب هوك", "القوالب", "حد الرسائل", "التكلفة". Also triggers on "WhatsApp Business Manager", "WhatsApp Manager", «واتساب بزنس مانجر».
metadata:
  summary: "WhatsApp Cloud API guide: webhooks, message templates, limits and pricing."
  tags: whatsapp, whatsapp-cloud-api, meta, webhooks, api
---

# WhatsApp Business Manager

**Read when:** planning, building or answering anything on the WhatsApp Business APIs.
**Owns:** the capability catalog, the webhook-vs-polling split, and the limits and dates that change
designs (researched from Meta's docs 2026-10-27, key facts re-checked 2026-11-03; each fact carries its
own date).

## TL;DR

The five facts that decide most designs:

1. **No message history API.** You cannot list sent messages, read a message's status later, list
   conversations or customers, or fetch inbound messages. Statuses and replies arrive only by webhook and
   Meta keeps no backfill: store each event on arrival. Why: anything not stored is gone for good.
2. **Without webhooks you still get a lot:** account and number health, quality, messaging limits,
   templates (full CRUD, library, block-rate comparison, archive, unpause, migrate), analytics (traffic,
   per template, cost by country, number, category and tier), business profile, QR codes, block list, ice
   breakers, Flows management, and an activity log (`GET /{WABA}/activities`).
3. **One webhook URL per Meta app.** Overrides move `messages`, calls and group fields per WABA or per
   number; template and account events always go to the app default. When another system already
   receives a WABA's webhooks, choose on purpose: forward from it, or take the subscription over knowing
   it then loses them. Why: an override silently takes messages away from the system that had them.
4. **Costs and marketing are moving.** Billing is per delivered message; from 2026-10-01 service and
   in-window utility messages are charged beyond a free tier, and marketing on Cloud API ends 2027-10-13
   (moves to the Marketing Messages API). Check both before any design that sends at volume.
5. **Avoid deprecated fields:** `messaging_limit_tier` (use `whatsapp_business_manager_messaging_limit`),
   `conversation_analytics` (use `pricing_analytics`), the Flows Metrics API (use `flows` webhook alerts),
   `billable` in status pricing (use `pricing.type` + `pricing.category`); the two-step PIN is being
   phased out for eligible numbers (checked 2026-11-03).

## How to answer

1. Find the topic in the table below and open that one reference file.
2. Say whether the capability works **without webhooks**, **partly** (the call works, but its result
   arrives only by webhook) or **needs webhooks**.
3. Facts change often. Before building on one, re-check its page: append `.md` to any page under
   `https://developers.facebook.com/documentation/business-messaging/whatsapp/` for a short version;
   `…/whatsapp/llms.txt` lists every page. The main changelog stops at 2026-05-12; later changes live on
   topic pages and in their own changelogs (Marketing Messages API, BSUIDs, Flows, Calling)
   (checked 2026-11-03).
4. Current Graph API version: v26.0, released 2026-07-29; v25.0 expires 2028-07-29 (checked 2026-11-03).

## Where each topic lives

| Topic | File |
|---|---|
| Account model change, WABA and portfolio fields, health status, activity log, users; phone numbers (fields, register, PIN, display name, Official Business Account, settings); business profile; usernames; ice breakers, QR codes, block list; templates (list, create, edit, delete, archive, unpause, library, migrate, groups, types, TTL) and categories | [references/account-and-templates.md](references/account-and-templates.md) |
| Analytics endpoints (`analytics`, `pricing_analytics`, `template_analytics`, template comparison, calls, groups); pricing model and every price-related date; messaging limits; throughput; credit line | [references/analytics-and-pricing.md](references/analytics-and-pricing.md) |
| Sending: the 24-hour window, every message type, media, Flows, Marketing Messages API and the end of marketing on Cloud API, Calling, Groups, commerce and payments, BSUIDs | [references/sending.md](references/sending.md) |
| Webhooks: one URL per app, setup (verify, signature, retries, overrides, mTLS), every field and the feature it enables, inbound message types, statuses, what no API gives | [references/webhooks.md](references/webhooks.md) |
| What a shared-inbox or CRM product built on the API needs, mapped to Meta capabilities | [references/inbox-platform-checklist.md](references/inbox-platform-checklist.md) |

## Safety when testing against a real account

- Read calls are safe. Creating, editing or deleting templates, sending messages, changing the profile,
  registering numbers and turning on insights (`is_enabled_for_insights` is irreversible) all change a
  live business account: do them only when the user asks for that action.
- Changing a webhook subscription or override can cut another system off from its messages: check
  `GET /{WABA}/subscribed_apps` and the number's `webhook_configuration` first.
- Never print or commit access tokens; use demo data in screenshots and examples.
