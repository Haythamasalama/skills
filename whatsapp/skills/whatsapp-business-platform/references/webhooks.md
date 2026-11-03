# Webhooks: every field and what it unlocks

Researched from Meta's docs on 2026-10-27, key facts re-checked 2026-11-03. Doc paths are relative to
`https://developers.facebook.com/documentation/business-messaging/whatsapp/`; `R/` means `webhooks/reference/`.
UNVERIFIED marks what no doc page confirmed.

## The facts that decide a design

- **No backfill.** "There are no APIs for fetching historical webhook data, so capture and store webhook
  payloads accordingly." (webhooks/create-webhook-endpoint, checked 2026-10-27). Anything not stored on arrival
  is gone.
- **One callback URL per app** (solution-providers/get-started-for-solution-partners). Overrides can move some
  fields per WABA or per phone number, but the template and account fields always go to the app default.
- **Several apps on one WABA:** `GET /{WABA}/subscribed_apps` returns an array and the example shows two apps.
  No doc sentence says every subscribed app gets every webhook (UNVERIFIED). Test on one account first.
- **Retries:** immediately, then with decreasing frequency for up to 7 days; dropped after 7 days. Retries go to
  all subscribed apps, so deduplicate.
- Batches of up to 1,000 updates (not guaranteed); payloads up to 3 MB; no ordering guarantee documented, and
  `delivered` can be skipped, so order statuses by precedence and timestamp.
- Some webhooks are not sent while the app is in Dev mode.

## Setup

- **Verify:** GET with `hub.mode=subscribe`, `hub.challenge`, `hub.verify_token`; answer 200 with the challenge.
- **Signature:** `X-Hub-Signature-256: sha256=<hex>` = HMAC-SHA256 of the raw body with the app secret.
- **TLS:** a valid certificate; self-signed is refused. mTLS is supported (Meta CA
  `meta-outbound-api-ca-2025-12.pem`, CN `client.webhooks.fbclientcerts.com`), per app only.
- **IP allow-list:** AS32934 or facebook.com/peering/geofeed; Meta recommends mTLS instead.
- **Subscribe each WABA:** `POST /{WABA}/subscribed_apps` ("You must individually subscribe to every Messaging
  account").
- **Overrides** (webhooks/override, checked 2026-11-03): per WABA `POST /{WABA}/subscribed_apps` with `override_callback_uri` +
  `verify_token`; per number `POST /{PNID}` with `webhook_configuration`. Precedence: number, WABA, app default.
  Re-subscribing with no body removes the WABA override.
  - Overridable: messages, calls, the four group_* fields, history, smb_message_echoes, smb_app_state_sync,
    account_settings_update (plus message_echoes, consumer_profile, messaging_handovers, standby: listed, no
    WhatsApp payload doc).
  - Never overridden: the four template fields, account_update, account_review_update, account_alerts, and any
    field not on the list.
  - **Risk:** overriding `messages` on an app another system already uses takes that system's messages away.
- **Permissions:** `whatsapp_business_messaging` for `messages` and `calls`; `whatsapp_business_management` for
  the rest.
- Envelope: `object: "whatsapp_business_account"`, `entry[].id` (WABA id; business id for partner_solutions),
  `entry[].changes[].field` and `.value`.

## Fields

| Field | Key payload | Feature it enables |
|---|---|---|
| `messages` | inbound `messages[]` + `contacts[]`; outbound `statuses[]`; `errors[]` | message log, delivery funnel, failure reasons, per-message cost, inbox, reply times, ad attribution |
| `message_template_status_update` | id, name, language, category; `event` APPROVED, REJECTED, PENDING, PAUSED, DISABLED, FLAGGED, IN_APPEAL, LOCKED, REINSTATED, ARCHIVED, UNARCHIVED, LIMIT_EXCEEDED, PENDING_DELETION, DELETED; `reason` ABUSIVE_CONTENT, INCORRECT_CATEGORY, INVALID_FORMAT, PROMOTIONAL, SCAM, TAG_CONTENT_MISMATCH, NONE; `disable_info.disable_date`; `other_info.title` FIRST_PAUSE, SECOND_PAUSE, RATE_LIMITING_PAUSE, UNPAUSE, DISABLED | instant approval/rejection alert with the reason, status timeline, first vs second pause, archive countdown (deleted after 28 days) |
| `message_template_quality_update` | `previous_quality_score`, `new_quality_score` (GREEN, YELLOW, RED, UNKNOWN) | quality timeline, alert on RED |
| `message_template_components_update` | body, header text, footer, URL and phone buttons | audit log of template edits |
| `template_category_update` | impending (24 h ahead): `correct_category`, `new_category` = current, `category_update_timestamp`; completed: `previous_category`, `new_category` | warning before Meta recategorizes a template (price change) |
| `phone_number_quality_update` | `event` ONBOARDING, THROUGHPUT_UPGRADE; `max_daily_conversations_per_business` TIER_50..TIER_UNLIMITED; `current_limit`/`old_limit` deprecated | limit and throughput change log |
| `phone_number_name_update` | `decision` APPROVED, REJECTED, DEFERRED, PENDING; `requested_verified_name`; `rejection_reason` | display-name review tracker |
| `account_update` | `event`: PARTNER_ADDED/REMOVED, PARTNER_APP_INSTALLED/UNINSTALLED, ACCOUNT_VIOLATION (`violation_info`), DISABLED_UPDATE (`ban_info`: DISABLE, REINSTATE, SCHEDULE_FOR_DISABLE + `waba_ban_date`), ACCOUNT_RESTRICTION (`restriction_info[]` type, expiration, remediation), ACCOUNT_DELETED, AD_ACCOUNT_LINKED, AUTH_INTL_PRICE_ELIGIBILITY_UPDATE, BUSINESS_PRIMARY_LOCATION_COUNTRY_UPDATE, MM_LITE_TERMS_SIGNED, VOLUME_BASED_PRICING_TIER_UPDATE, ACCOUNT_OFFBOARDED, ACCOUNT_RECONNECTED | account health feed: violations, restriction countdown, scheduled ban date, volume tier |
| `account_review_update` | `decision` APPROVED, REJECTED, PENDING, DEFERRED | review badge |
| `account_alerts` | `entity_type` BUSINESS or PHONE_NUMBER, `alert_severity` CRITICAL/WARNING/INFORMATIONAL, `alert_type` (INCREASED_CAPABILITIES_ELIGIBILITY_*, OBA_APPROVED/REJECTED, PROFILE_PICTURE_LOST), `alert_description` | alert inbox with Meta's next step |
| `business_capability_update` | `max_daily_conversations_per_business`, `max_phone_numbers_per_business`/`_per_waba` (doc inconsistent: integer vs TIER_ string) | portfolio limit history |
| `security` | `event` PIN_CHANGED, PIN_RESET_REQUEST, PIN_REQUEST_SUCCESS; `requester` | two-step PIN audit, alert on reset attempts |
| `user_preferences` | `wa_id`/`user_id`, `category: marketing_messages`, `value` stop/resume, `timestamp` | marketing opt-out list and opt-out rate per campaign |
| `flows` | FLOW_STATUS_CHANGE, CLIENT_ERROR_RATE, ENDPOINT_ERROR_RATE, ENDPOINT_LATENCY (p50, p90), ENDPOINT_AVAILABILITY, FLOW_VERSION_EXPIRY_WARNING; `alert_state` | Flow health alerts (thresholds 5/10/50 % errors, p90 1/5/7 s, availability < 90 %) |
| `calls` | `calls[]` id, from/to, `event` connect, call_created, terminate, call_recording_available, call_transcription_available; `direction`, `status`, duration; `statuses[]` RINGING/ACCEPTED/REJECTED | call volume, answer rate, durations; recordings kept 7 days |
| `account_settings_update` | calling settings changes | settings audit |
| `group_lifecycle_update`, `group_participants_update`, `group_settings_update`, `group_status_update` | create/delete with invite link; joins, requests, removals; subject/description/picture; suspend/cleared | group inventory, churn, suspension alert |
| `business_username_updates` | `username`, `status` approved/reserved/deleted, `context` revoked (when Meta revokes a username, 2026-09-15) | username tracker (renamed 2026-02-06) |
| `automatic_events` | wamid, `event_name` Purchase/LeadSubmitted, `ctwa_clid`, `custom_data` | revenue and leads per click-to-WhatsApp ad (opt-in) |
| `history` | 180 days of chat history in chunks | import past chats, coexistence numbers only |
| `smb_message_echoes`, `smb_app_state_sync` | messages sent from the WhatsApp Business app; contact add/remove | coexistence only |
| `partner_solutions`, `payment_configuration_update` | partner solution status; payment gateway status | partners; India/Brazil payments |

Not a webhook field: `user_id_update` ("There is no user_id_update webhook field"; BSUID changes arrive as
`system` messages; checked 2026-11-03). Marketing link clicks arrive as `marketing_messages_link_click` on
`messages`, limited availability, last 7 days. Marketing Messages API landing page views arrive as
`landing_page_view` (added 2026-09-23).

## Inside `messages`

Inbound common fields: `metadata.display_phone_number`, `metadata.phone_number_id`; `contacts[].profile.name`,
`wa_id` (can be omitted), `user_id` (BSUID, since April 2026), `profile.username`; `messages[].from`,
`from_user_id`, `id`, `timestamp`, `type`, `group_id`; `context` (reply-to `id`/`from`, `forwarded`,
`frequently_forwarded`, `referred_product`); `referral` for click-to-WhatsApp ads (`source_url`, `source_id`,
`headline`, `body`, media, `ctwa_clid`, `welcome_message.text`).

| Type | Key fields |
|---|---|
| text | `text.body` |
| image, video, document, audio, sticker | `id`, `mime_type`, `sha256`, `caption`, `url`; `audio.voice`; media ids downloadable 7 days (since 2025-10-09) |
| location | `latitude`, `longitude`, `name`, `address`, `url` |
| contacts | name, phones, emails, addresses, org, urls, birthday |
| interactive | `button_reply`, `list_reply`, `nfm_reply` (Flow answer: `response_json`), `call_permission_reply` |
| button | `button.payload`, `button.text`; `context.id` = the template message: quick-reply taps per template |
| reaction | `message_id`, `emoji` (omitted on removal); business messages of the last 30 days |
| order | `catalog_id`, `product_items[]` (no total) |
| system | `user_changed_number`, `user_changed_user_id` |
| edit, revoke | coexistence only |
| unsupported | real type included since 2025-11-03 (poll, gif, pin, ...) |
| errors | `value.errors[]` code, title, message, details (e.g. 130429 rate limit) |

Statuses (`statuses[]`): `sent`, `delivered` (can be skipped), `read`, `failed` (`errors[]`; 131049 = Meta's
per-user marketing cap, 131050 = user stopped marketing), `played` (first play of a voice message, since
2025-11-03). Fields: `id` (wamid), `recipient_id`, `recipient_user_id`, `timestamp`,
`biz_opaque_callback_data` (set on send, up to 512 chars, echoed back), `pricing` (on `sent` plus one of
delivered/read: `type` regular, free_customer_service, free_entry_point, free_group_customer_service;
`category` authentication, authentication-international, marketing, marketing_lite, utility, service,
referral_conversion, group_marketing, group_utility, group_service; `subtype` paid_exempt on free service
messages of eligible government and non-profit organizations, from 2026-10-12; `billable` to be deprecated,
use type + category), `conversation` (v24.0+ only in a free entry point window) (messages/status, checked
2026-11-03). From 2026-10-01 `free_customer_service` means a 1:1 service message inside the monthly free
tier; before that it also covered in-window utility messages.

## Data only webhooks give

Inbound messages of every type, per-message statuses with cost and error codes, marketing opt-outs, ad click
ids, call events and recordings, group events, PIN events, account alert and violation history, the 24-hour
recategorization warning. Template status, quality, category, number limits and `health_status` can also be
polled; for those the webhook only adds speed, reasons and history.
