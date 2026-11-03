# Account, phone numbers and templates

**Read when:** reading or changing a WhatsApp Business Account, its phone numbers, profile or templates.
**Owns:** the account model, WABA and phone-number fields, business profile, usernames, account-side
features (ice breakers, QR codes, block list), and the full template lifecycle and categories.

**TL;DR**
- Everything here works without webhooks; webhooks only add speed and history.
- `health_status` on a WABA, number or template is the clearest "can we send now, and why not".
- Templates: 100 creations per hour, edits limited to 1 per 24 h once approved, category sets the price,
  and Meta may recategorize an approved template.
- Plan for WAAC ids in 2027: phone-number ids stop working on many paths in 2028.

Host `graph.facebook.com/v26.0`. `D/` = `https://developers.facebook.com/documentation/business-messaging/whatsapp/`.
PNID = phone number id. Permissions: `whatsapp_business_management` for nearly everything here;
`whatsapp_business_messaging` for register and PIN; `business_management` for portfolio-level fields.

## Account model change

`D/account-model-evolution` (checked 2026-11-03). Phase 1 rolled out from 2026-09-23 to all businesses by
mid-October 2026. A WABA is now a "Messaging account" (same id); each number sits in a "WhatsApp account"
(WAAC), a container for one number (later one username), its profile and catalog.
- Phase 1: WAAC ids are not exposed; phone-number ids keep working everywhere.
- Phase 2 (H1 2027): WAAC ids and WAAC endpoints arrive; new APIs accept either id.
- Phase 3 (H1 2028): paths that take a phone-number id (including Messages and Marketing Messages) must
  use the WAAC id. Plan that work in 2027.

## WABA (Messaging account) and business portfolio

| Capability | Call | Notes |
|---|---|---|
| Read the account | `GET /{WABA}?fields=` name, currency, timezone_id, message_template_namespace, status, country, account_review_status, business_verification_status (VERIFIED, PENDING, PENDING_NEED_MORE_INFO, NOT_VERIFIED, REJECTED, REVOKED, EXPIRED, …), ownership_type, primary_business_location, health_status, is_enabled_for_insights, primary_funding_id (absent = cannot send paid messages), marketing_messages_onboarding_status, whatsapp_business_manager_messaging_limit, service_pricing_policy | default fields are id and name |
| Health | `GET /{WABA or PNID or TEMPLATE}?fields=health_status` → `can_send_message` AVAILABLE/LIMITED/BLOCKED, `entities[]` with `errors[]` (error_code, error_description, **possible_solution**) | `D/support/health-status` |
| **Activity log** | `GET /{WABA}/activities?fields=id,actor_business_id,actor_id,category,event_type,timestamp` | ≤ 100 per page, no date filter; categories ACCOUNT, APP, BILLING, BUSINESS_PROFILE, MESSAGE_TEMPLATE, PAYMENT_CONFIGURATION, PHONE_NUMBER, USER; ~60 event types (template added/edited/deleted, PIN changed, number registered, user added). A polling stand-in for many webhook events |
| Users with access | `GET /{WABA}/assigned_users?business={BIZ}`; `POST {user, tasks[]}`; `DELETE {user}` | tasks MANAGE, DEVELOP, MANAGE_TEMPLATES, MANAGE_PHONE, VIEW_COST, MESSAGING, … |
| Subscribed apps | `GET/POST/DELETE /{WABA}/subscribed_apps` | see webhooks.md |
| Campaign schedules | `GET/POST /{WABA}/schedules` | reference page only, no guide (UNVERIFIED) |
| Turn on template insights | `POST /{WABA}?is_enabled_for_insights=true` | **irreversible**; turns on link tracking |
| List accounts | `GET /{BIZ}/owned_whatsapp_business_accounts`, `/client_whatsapp_business_accounts` | |
| Currency change | `POST /{WABA}/set_payment_method_migration_intent` | clones the WABA (new template ids) |

Not possible by API: start business verification, delete a phone number, turn off two-step verification,
appeal a rejected template (WhatsApp Manager only).

## Phone numbers

| Capability | Call | Notes |
|---|---|---|
| List | `GET /{WABA}/phone_numbers?fields&filtering=[…]&sort=` | `filtering` is beta |
| Fields | display_phone_number, verified_name, status (CONNECTED, DISCONNECTED, PENDING, FLAGGED, RESTRICTED, RATE_LIMITED, BANNED, DELETED, MIGRATED), quality_rating (GREEN/YELLOW/RED/UNKNOWN), name_status, new_display_name, new_name_status, code_verification_status, account_mode (LIVE/SANDBOX), platform_type, last_onboarded_time, is_official_business_account, throughput{level}, health_status, webhook_configuration, conversational_automation, whatsapp_business_manager_messaging_limit | limits and throughput: analytics-and-pricing.md |
| Add a number, OTP | `POST /{WABA}/phone_numbers`; `POST /{PNID}/request_code` (SMS/VOICE), `/verify_code` | |
| Register / deregister | `POST /{PNID}/register` {pin, data_localization_region}, `/deregister` | 10 per 72 h each |
| Two-step PIN | `POST /{PNID}` {pin} | no read, no disable. Being phased out for eligible numbers with phase 1 of the account model change: if WhatsApp Manager shows no two-step tab, there is no PIN. Keep sending a valid 6-digit `pin` to `register` until Meta changes that contract (checked 2026-11-03) |
| Display name change | `POST /{PNID}?new_display_name=` | 10 per 30 days; decision by `phone_number_name_update` webhook or polling `name_status` |
| Settings | `GET/POST /{PNID}/settings`: calling, user_identity_change, payload_encryption, storage_configuration | one feature per POST |

### Official Business Account (green badge)

Read `GET /{PNID}?fields=official_business_account`; `GET/POST /{PNID}/official_business_account`
(website, country, 5–10 supporting links). Needs a verified portfolio, 30+ days of use, two-step
verification and an approved display name. The request API path is UNVERIFIED; WhatsApp Manager works.

## Business profile

`GET /{PNID}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites,vertical`
· `POST` the same fields with `messaging_product: "whatsapp"` and `profile_picture_handle` (upload the
photo with the Resumable Upload API first). Address ≤ 256 chars. Vertical values include AUTO, BEAUTY, EDU,
FINANCE, GOVT, HEALTH, HOTEL, PROF_SERVICES, RESTAURANT, RETAIL, TRAVEL, OTHER. No webhook needed.

## Business usernames

`GET/POST/DELETE /{PNID}/username`, `GET /{PNID}/username_suggestions`; 2 changes per 14 days.
Businesses can reserve usernames since 2026-06-29 (business-scoped-user-ids, checked 2026-11-03). Status
changes arrive on the `business_username_updates` webhook. How consumer usernames change customer ids:
sending.md, BSUIDs.

## Account-side features (no webhook needed)

| Feature | Call | Notes |
|---|---|---|
| Ice breakers, commands, welcome | `POST /{PNID}/conversational_automation` {enable_welcome_message, prompts, commands}; read `GET /{PNID}?fields=conversational_automation` | ≤ 4 prompts × 80 chars, ≤ 30 commands; taps arrive as messages; `enable_welcome_message` is UNVERIFIED |
| QR codes and short links | `POST/GET /{PNID}/message_qrdls`, `GET/DELETE …/{code}` | prefilled text ≤ 140 chars, ≤ 2,000 per number, SVG/PNG, no analytics |
| Block users | `POST/DELETE/GET /{PNID}/block_users` | only users who wrote in the last 24 h; ≤ 1,000 per call, 64,000 max |
| Contact book check | `GET /{PNID}/contact_book?bsuid=` | yes/no; never returns a phone number |
| Welcome message sequences for click-to-WhatsApp ads | `POST/GET/DELETE /{WABA}/welcome_message_sequences` | |

## Templates

| Capability | Call | Notes |
|---|---|---|
| List / filter | `GET /{WABA}/message_templates?fields&limit` + filters category, content, language, name, name_or_content, quality_score, status, since/until; `summary=total_count,message_template_count,message_template_limit` | the limit tells how many more you can create |
| Fields | id, name, language, category, sub_category, status (APPROVED, PENDING, REJECTED, PAUSED, DISABLED, IN_APPEAL, LIMIT_EXCEEDED, PENDING_DELETION, DELETED, ARCHIVED), quality_score{score, date}, rejected_reason, previous_category, correct_category, parameter_format, components, message_send_ttl_seconds, cta_url_link_tracking_opted_out, library_template_name, health_status, last_updated_time | |
| Create | `POST /{WABA}/message_templates` | 100 per hour per WABA; cap 250 (unverified portfolio) or 6,000 (verified, with an approved display name); each language counts (checked 2026-11-03) |
| Edit | `POST /{TEMPLATE}` {components replaces all, category, ttl, …} | APPROVED/REJECTED/PAUSED only; approved: 1 per 24 h, 10 per 30 days; approved category cannot change (checked 2026-11-03) |
| Delete | `DELETE /{WABA}/message_templates?name=` (all languages), `?hsm_id=&name=` (one), `?hsm_ids=[≤100]` | name blocked 30 days; DISABLED cannot be deleted; one bad id fails the whole bulk call; undelivered messages keep PENDING_DELETION for 30 days (checked 2026-11-03) |
| Archive / unarchive | `POST /{WABA}/message_templates/archive`, `/unarchive` {hsm_ids} | auto-archived after 12 months unused, deleted 28 days later (checked 2026-11-03) |
| Unpause | `POST /{TEMPLATE}/unpause` | for pacing pauses; quality pauses last 3 h then 6 h, the third disables (checked 2026-11-03) |
| Library | `GET /message_template_library?search&topic&usecase&industry&language` | create with `library_template_name`; UTILITY only |
| Copy between WABAs | `POST /{DEST_WABA}/migrate_message_templates` {source_waba_id, template_ids ≤ 500} | same owner; APPROVED with GREEN/UNKNOWN quality only |
| Template groups | `POST /{WABA}/template_groups`, `GET/POST/DELETE /{GROUP}` | one group per template |
| Authentication | `POST /{WABA}/upsert_message_templates` (bulk), `GET /{WABA}/message_template_previews` | |

Block rate and per-template analytics: analytics-and-pricing.md.

### Template types worth knowing

- **Authentication:** OTP button `copy_code`, `one_tap`, `zero_tap` (one-tap and zero-tap are Android
  only; the PendingIntent handshake was deprecated 2026-10-15, use the OTP SDK).
- **Marketing:** coupon code (copy-code button, ≤ 20 chars), limited-time offer (`expiration_time_ms` at
  send, no footer), media card carousel (2–10 cards), location header (also utility), product and catalog
  templates.
- Components: call permission request, voice-call button, Flow button; URL title override.
- **Time to live** (templates/time-to-live, checked 2026-11-03): `message_send_ttl_seconds`:
  authentication 30 s–15 min (default 10 min), utility 30 s–12 h (default 30 days), marketing 12 h–30 d
  (Marketing Messages API only).
- UNVERIFIED: booking and location-request templates.

### Template categories (`D/templates/template-categorization`, checked 2026-11-03)

- Three categories: MARKETING, UTILITY, AUTHENTICATION. Category sets the price.
- UTILITY must be non-promotional and tied to the user (a request or a transaction, e.g. an order update
  from an online store). Mixed or unclear content is MARKETING. AUTHENTICATION must use a library OTP
  template: no URLs, media or emojis.
- Since 2025-04-09 a UTILITY template Meta judges as marketing is approved as MARKETING (no
  `allow_category_change` needed). Meta also re-checks approved templates and recategorizes them,
  normally with 24 h notice by the `template_category_update` webhook; for businesses warned about misuse
  the change is instant.
- Utility misuse escalates: warning, rate limiting (≥ 7 days), utility restriction (7 or 30 days),
  portfolio-wide restriction (30 days); notices come by email and `account_update`.
- A category review or appeal (60 days) is possible only in WhatsApp Manager / Business Support Home.
