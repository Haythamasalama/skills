---
name: linkedin-posts
description: Use when writing, polishing or publishing a LinkedIn post or an X (Twitter) thread for the owner, especially launching an open-source project or a product he built, in Arabic or English. Covers the "developer story" structure that worked, Arabic tone, one strong image instead of carousels or PDFs, making the image from HTML, the approval rule (show the final draft, publish only on an explicit go), posting through the browser and the LinkedIn composer quirks, and checking the post after it is live. Triggers include "منشور لينكدين", "بوست", "انشر على لينكدين", "ثريد تويتر", "LinkedIn post", "launch post".
---

# LinkedIn and X posts

**Read when:** drafting or publishing a post about something the owner built or learned.
**Owns:** structure, tone, image, approval and publishing steps. For the visual identity see the
`haytham-brand` skill; for long articles turned into posts see `tech-articles`.

## TL;DR

- **Never publish without an explicit word from the user in this turn** ("انشر", "publish"). Show the
  final text and the image first, every time, even after earlier approvals.
- Tell a short developer story, not a feature list: the pain, the decision, what it is, 3–4 concrete
  points, how it runs, one question to the reader, links, hashtags.
- **One image.** A single clear product screenshot (in the post's language) beat a 6-image carousel;
  nobody opens PDFs. Make extra images only if asked.
- Arabic posts are written in simple Modern Standard Arabic (فصحى بسيطة), warm and direct, with
  technical names left in Latin script (Nuxt, Docker, SQLite).
- Attach the image **before** pasting text that contains a link: once LinkedIn shows a link preview the
  media button disappears.
- After publishing, open the post's URL and check the text, the image count and the links.

## 1. Structure that worked (Arabic launch post, Oct 2026)

1. **Hook — the daily pain, in first person.** "كنت أفتح … كل يوم، وأتنقّل بين … لأعرف ثلاثة أشياء:"
   then the three questions on one line.
2. **The decision.** One sentence: after doing it many times, I built the tool I needed.
3. **What it is.** "اليوم أشارككم «الاسم»: لوحة واحدة …" — the product name in «» quotes.
4. **3–4 points**, each starting with one emoji that matches it (✅ 💰 📱 ✍️), each a concrete outcome
   with a number where possible ("خلال 30 يوماً", "يوماً بيوم").
5. **How it runs / trust.** e.g. runs on your own server with one Docker command, the token never leaves it.
6. **Stack + price.** "بنيتها بـ … وهي مجانية ومفتوحة المصدر بالكامل".
7. **One question to the reader** to invite comments: "ما الميزة التي تتمنى أن أضيفها بعد ذلك؟ 👇"
8. **Links** on their own lines with an emoji label (🔗 site in the post's language, ⭐ repo).
9. **Hashtags:** 4–6, mixing Arabic and English (`#واتساب_الأعمال #مفتوح_المصدر #OpenSource #BuildInPublic`).

Keep it under ~1,300 characters; short lines; one blank line between blocks.

What the user rejected on the way there: a plain feature list ("سيء"), a stiff corporate tone, and
anything that sounded generated. Offer 2–3 short variants (e.g. "قصة مبرمج", "مباشر", "سؤال للجمهور")
when the user is unhappy, and let them pick.

## 2. Tone rules

- First person, the builder speaking to peers. Concrete over impressive: numbers, real steps.
- No marketing superlatives ("ثوري", "الأفضل", "blazingly fast"), no fake metrics.
- Emojis: one per point, plus at most 2 elsewhere. Never a row of emojis.
- English posts follow the same order; plain words, short sentences.
- Run the `humanizer` skill (if installed) over the English draft to remove AI tells.

## 3. The image

- Default: **one** 1200×1500 (4:5) card: brand mark + name, one headline, the product screenshot in a
  framed panel, 3 short facts, and the address as a bar at the bottom. Template:
  [assets/single-card.html](assets/single-card.html). Arabic post → Arabic screenshot and `dir="rtl"`.
- Or simply the best real screenshot of the product, if the user prefers ("خد الصورة هادي").
- Render HTML to PNG with Playwright or headless Chrome at device scale 2:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=out.png --window-size=1200,1500 card.html`
  (or Playwright `page.screenshot({ clip })` for exact size). Look at the PNG before showing it.
- Use only demo data in screenshots: no real phone numbers, customer names, tokens or company data.

## 4. Publishing through the browser

- Use the built-in browser (or Claude in Chrome). The user signs in themselves; never type a password.
- LinkedIn composer order: open "Start a post" → **add the image first** (media button) → paste the
  text → wait for the link preview, remove it if it replaced the image → check for stray characters
  (a lost keystroke once left "lh" in the text; fix with select-all, delete, paste again) → show the
  user a screenshot of the composer → publish only on their word.
- Deleting a post is also outward-facing: only when the user asks.
- X thread: first tweet = hook + one-line value; 3–5 follow-ups (one feature each); last = link + ask
  for a star or a reply. Type into the thread modal's own textbox (the page has a second one behind it).
  Mention accounts only when they are truly relevant to the topic (the user rejected unrelated big
  accounts: "بدنا الناس المهتمة").

## 5. After it is live

- Open the post URL; confirm text, image count, links. An old post reading "Post not found" means it is
  already deleted.
- Advice to give the user: reply to every comment in the first hours; pin the repo link in the first
  comment only if the user wants it there.
