# Account management, analytics and templates (no webhooks needed)

Researched from Meta's docs on 2026-10-27; host `graph.facebook.com/v26.0`. `D/` =
`https://developers.facebook.com/documentation/business-messaging/whatsapp/`, `R/` = `D/reference/`.
Permissions: `whatsapp_business_management` (WBM) for nearly everything here; `whatsapp_business_messaging`
for register/PIN; `business_management` for portfolio-level fields and credit lines. The changelog stops at
2026-05-12; later changes live only on topic pages.

**Account model change:** from 2026-09-23 WABA ids are called "Messaging account" ids and numbers sit in a
"WhatsApp account" (WAAC). Old ids and endpoints keep working; WAAC endpoints come in H1 2027 and replace
phone-number ids in paths in H1 2028 (`D/account-model-evolution`).

## WABA (Messaging account) and business portfolio

| Capability | Call | Notes |
|---|---|---|
| Read the account | `GET /{WABA}?fields=` name, currency, timezone_id, message_template_namespace, status, country, account_review_status, business_verification_status (VERIFIED, PENDING, PENDING_NEED_MORE_INFO, NOT_VERIFIED, REJECTED, REVOKED, EXPIRED, …), ownership_type, primary_business_location, health_status, is_enabled_for_insights, primary_funding_id (absent = cannot send paid messages), marketing_messages_onboarding_status, whatsapp_business_manager_messaging_limit, service_pricing_policy | default fields are id and name |
| Health | `GET /{WABA or PNID or TEMPLATE}?fields=health_status` → `can_send_message` AVAILABLE/LIMITED/BLOCKED, `entities[]` with `errors[]` (error_code, error_description, **possible_solution**) | `D/support/health-status`; the clearest "can we send now, and why not" |
| **Activity log** | `GET /{WABA}/activities?fields=id,actor_business_id,actor_id,category,event_type,timestamp` | ≤ 100 per page, no date filter; categories ACCOUNT, APP, BILLING, BUSINESS_PROFILE, MESSAGE_TEMPLATE, PAYMENT_CONFIGURATION, PHONE_NUMBER, USER; ~60 event types (template added/edited/deleted, PIN changed, number registered, user added) — a polling stand-in for many webhook events |
| Users with access | `GET /{WABA}/assigned_users?business={BIZ}`; `POST {user, tasks[]}`; `DELETE {user}` | tasks MANAGE, DEVELOP, MANAGE_TEMPLATES, MANAGE_PHONE, VIEW_COST, MESSAGING, … |
| Subscribed apps | `GET/POST/DELETE /{WABA}/subscribed_apps` | see webhooks.md |
| Campaign schedules | `GET/POST /{WABA}/schedules` | reference page only, no guide (UNVERIFIED) |
| Turn on template insights | `POST /{WABA}?is_enabled_for_insights=true` | **irreversible**; turns on link tracking |
| List accounts | `GET /{BIZ}/owned_whatsapp_business_accounts`, `/client_whatsapp_business_accounts` | |
| Portfolio limit | `GET /{BIZ}?fields=whatsapp_business_manager_messaging_limit` | the limit is per portfolio since 2025-10-07 |
| Credit line | `GET /{BIZ}/extendedcredits` (balance, credit_available, max_balance, allocated_amount, legal_entity_name, is_access_revoked) | no balance API for card billing |
| Currency change | `POST /{WABA}/set_payment_method_migration_intent` | clones the WABA (new template ids) |

Not possible by API: start business verification, delete a phone number, turn off two-step verification,
appeal a rejected template (WhatsApp Manager only).

## Phone numbers

| Capability | Call | Notes |
|---|---|---|
| List | `GET /{WABA}/phone_numbers?fields&filtering=[…]&sort=` | `filtering` is beta |
| Fields | display_phone_number, verified_name, status (CONNECTED, DISCONNECTED, PENDING, FLAGGED, RESTRICTED, RATE_LIMITED, BANNED, DELETED, MIGRATED), quality_rating (GREEN/YELLOW/RED/UNKNOWN), name_status, new_display_name, new_name_status, code_verification_status, account_mode (LIVE/SANDBOX), platform_type, last_onboarded_time, is_official_business_account, throughput{level}, health_status, webhook_configuration, conversational_automation | |
| **Messaging limit** | `whatsapp_business_manager_messaging_limit` (TIER_50, TIER_250, TIER_2K, TIER_10K, TIER_100K, TIER_UNLIMITED, UNTIERED) | `messaging_limit_tier` is **deprecated** (`D/messaging-limits`, checked 2026-10-27) |
| Add a number, OTP | `POST /{WABA}/phone_numbers`; `POST /{PNID}/request_code` (SMS/VOICE), `/verify_code` | |
| Register / deregister | `POST /{PNID}/register` {pin, data_localization_region}, `/deregister` | 10 per 72 h each |
| Two-step PIN | `POST /{PNID}` {pin} | no read, no disable; being phased out from 2026-09 |
| Display name change | `POST /{PNID}?new_display_name=` | 10 per 30 days |
| Settings | `GET/POST /{PNID}/settings`: calling, user_identity_change, payload_encryption, storage_configuration | one feature per POST |
| Official Business Account | `GET/POST /{PNID}/official_business_account` (website, country, supporting links 5–10) | needs a verified portfolio, 30+ days, 2FA, approved name |
| Username | `GET/POST /{PNID}/username`, `/username_suggestions` | 2 changes per 14 days |
| Ice breakers, commands, welcome | `POST /{PNID}/conversational_automation` {enable_welcome_message, prompts, commands} | |
| QR codes, block list, commerce | see sending-and-features.md | |

## Business profile

`GET /{PNID}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites,vertical`
· `POST` the same fields with `messaging_product: "whatsapp"` and `profile_picture_handle` (upload the photo
with the Resumable Upload API first). Address ≤ 256 chars. Vertical values include AUTO, BEAUTY, EDU, FINANCE,
GOVT, HEALTH, HOTEL, PROF_SERVICES, RESTAURANT, RETAIL, TRAVEL, OTHER.

## Analytics (all polling)

Fields on `GET /{WABA}?fields=X.start(unix).end(unix).granularity(...)` unless a path is shown. Lookback is
**1 year** since 2025-12-01 for analytics, conversation_analytics, pricing_analytics; 90 days for template and
group analytics.

| Metric | Call | Notes |
|---|---|---|
| All traffic | `analytics`: HALF_HOUR/DAY/MONTH; filter phone_numbers, country_codes, `product_types` (0 template, 2 non-template, 100 incoming) → sent, delivered | covers service replies and incoming too, not only templates |
| Cost | `pricing_analytics`: HALF_HOUR/DAILY/MONTHLY; metric COST, VOLUME; `dimensions` COUNTRY, PHONE, PRICING_CATEGORY, PRICING_TYPE, TIER; pricing_types FREE_CUSTOMER_SERVICE, FREE_ENTRY_POINT, REGULAR | TIER is the only source of volume-tier progress; SERVICE/UTILITY meanings changed 2026-10-01 |
| Conversations (legacy) | `conversation_analytics` | conversation pricing ended 2025-07-01 |
| Per template | `GET /{WABA}/template_analytics?template_ids=[≤10]&metric_types=SENT,DELIVERED,READ,CLICKED,COST&granularity=DAILY` (+ `product_type`, `use_waba_timezone`) | needs insights on; clicks only for MARKETING/UTILITY; read and click counts cover 7 days after send; **not available for EU or Japan** numbers; cost = amount_spent, cost_per_delivered, cost_per_url_button_click |
| Template groups | `GET /{WABA}/template_group_analytics?template_group_ids=[≤10]` | |
| **Block rate** | `GET /{TEMPLATE}/compare?template_ids=[other]&start&end` → BLOCK_RATE ranking, MESSAGE_SENDS, TOP_BLOCK_REASON | 2 templates of one WABA, each sent ≥ 1,000 times; windows 7/30/60/90 days (`D/templates/template-comparison`) |
| Calls | `call_analytics`: COUNT, COST, AVERAGE_DURATION by phone/direction/country | |
| Groups | `GET /{WABA}/group_analytics?group_ids=[1]` | |
| Flow endpoint metrics | `GET /{FLOW}?fields=metric.name(...)` | deprecated 2026-04-30 |

## Templates

| Capability | Call | Notes |
|---|---|---|
| List / filter | `GET /{WABA}/message_templates?fields&limit` + filters category, content, language, name, name_or_content, quality_score, status, since/until; `summary=total_count,message_template_count,message_template_limit` | the limit tells how many more you can create |
| Fields | id, name, language, category, sub_category, status (APPROVED, PENDING, REJECTED, PAUSED, DISABLED, IN_APPEAL, LIMIT_EXCEEDED, PENDING_DELETION, DELETED, ARCHIVED), quality_score{score, date}, rejected_reason, previous_category, correct_category, parameter_format, components, message_send_ttl_seconds, cta_url_link_tracking_opted_out, library_template_name, health_status, last_updated_time | |
| Create | `POST /{WABA}/message_templates` | 100 per hour per WABA; cap 250 (unverified portfolio) or 6,000 |
| Edit | `POST /{TEMPLATE}` {components replaces all, category, ttl, …} | APPROVED/REJECTED/PAUSED only; approved: 1 per 24 h, 10 per 30 days; approved category cannot change |
| Delete | `DELETE /{WABA}/message_templates?name=` (all languages), `?hsm_id=&name=` (one), `?hsm_ids=[≤100]` | name blocked 30 days; DISABLED cannot be deleted |
| Archive / unarchive | `POST /{WABA}/message_templates/archive`, `/unarchive` {hsm_ids} | auto-archived after 12 months unused, deleted 28 days later |
| Unpause | `POST /{TEMPLATE}/unpause` | for pacing pauses; quality pauses last 3 h then 6 h, the third disables |
| Library | `GET /message_template_library?search&topic&usecase&industry&language` | create with `library_template_name`, UTILITY only |
| Copy between WABAs | `POST /{DEST_WABA}/migrate_message_templates` {source_waba_id, template_ids ≤ 500} | same owner; APPROVED with GREEN/UNKNOWN quality only |
| Template groups | `POST /{WABA}/template_groups`, `GET/POST/DELETE /{GROUP}` | one group per template |
| Authentication | `POST /{WABA}/upsert_message_templates`, `GET /{WABA}/message_template_previews` | |

## What no API gives (evidence)

1. Inbound messages: the Message API reference has only `POST /{PNID}/messages`.
2. A sent message's status: the send response says only accepted / held_for_quality_assessment / paused. A
   `GET /{Message-History-ID}/events` reference exists but the "message history APIs" that would give the id
   are not documented (treat as unavailable).
3. A list of conversations or customers: none. Closest: `block_users`, `contact_book?bsuid=` (yes/no), group
   participants.
4. Coexistence history: `POST /{PNID}/smb_app_data` once within 24 h of onboarding; the data arrives only by
   webhook; partners only.
5. Push events (template status/quality/category, name decisions, account alerts, tier changes) are webhook
   only, but can be polled instead: templates with `since`/`status`/`quality_score.date`, phone
   `quality_rating`/`name_status`/`health_status`, WABA `account_review_status`, `/activities`, the
   `pricing_analytics` TIER dimension.
