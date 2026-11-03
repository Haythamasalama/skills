# On-screen copy

**Read when:** writing a label, a button, help under a field, an empty state, a confirm dialog, a
toast or a refusal, in Arabic or English, or adding translation keys.
**Owns:** who each surface is written for, the length budget, punctuation, verb-only labels, the
wording of confirms and danger zones, Arabic register, and the lang-file rules.

## TL;DR

- Short, plain, and only what the reader needs to act.
- A button says the verb alone. The card title already carries the context.
- Help under a field is one sentence of about twelve words.
- State the rule, not the reasoning; the reasoning goes in a code comment beside the rule.
- No em dashes, no semicolons, no "simply" or "please note" in UI text.
- Nothing on a screen describes the screen it is printed on.
- In a two-language app every string comes from the lang files, in both languages.

## Who reads it

| Surface | Reader | Register |
|---|---|---|
| product UI: labels, help, refusals, toasts | someone mid-task | the fewest words that let them act |
| a help guide | someone learning a screen | what a screen or setting means, in the words the screen uses |
| code comments | whoever changes the code next | the decision and why |

The commonest failure is writing one surface's sentence on another: an argument for a design decision
in a help line, addressed to someone who will never make that decision.

## Budget

| Surface | Budget |
|---|---|
| help under a field | one sentence, about 12 words |
| confirm dialog description | the consequence, and the way back if there is one |
| empty state description | one sentence naming the next action |
| panel or sheet subtitle | none: the content says it |
| toast | one clause |

Cut in this order and stop at the first cut that leaves a true sentence:

1. What the placeholder already shows. A worked example teaches faster than a sentence about it.
2. What still happens ("every other check still runs"). It reassures the writer, not the reader.
3. Why the rule exists. That goes in the code comment.
4. A consequence nobody can act on. "This cannot be undone" earns its place on a delete; "this is
   recorded" does not when everything is.

A destructive confirm is the one place a second sentence earns its keep, and only for the way back:
"Duplicate it first if you need the same lines again."

## The screen already says it

- An empty state's title already states the state, so the description only names the next action.
  If nothing survives the cut, drop the description: a title, an icon and the button is complete.
- A subtitle describing the table beneath it says nothing the column headers do not.
- What earns a line under a heading: a live value read from config, a fact the reader must meet
  before acting, or a consequence that is nowhere else on screen.

## Labels and buttons

| Where | Says | Not |
|---|---|---|
| a button | the verb alone: "Add", "Save", "Send" | "Create and configure the customer" |
| a field label in a titled card | the field alone: "Email" | "Billing contact email" |
| a confirm title | a question about the effect: "Delete this customer?" | "Are you sure?" |
| its description | the consequence and what survives it | the title again |
| a danger-zone description | what happens, one sentence, present tense | how it is implemented |
| a refusal | the next action, or who can take it | only what went wrong |

- **Say the effect, not the mechanism:** "The customer's history stays, but their access stops at
  once", not a sentence about soft-deleting a row.
- **Name the state before the action**, so a section reads correctly whether the record is active,
  paused or failed.
- **Use the words the screen uses.** A guide never names an internal key the UI does not show.
- **No warning that always shows.**
- **Ends with a period:** help lines, notes and descriptions, in Arabic as in English. Titles, labels
  and buttons never do.

## Punctuation

No em dashes on screen: a sentence with one is two sentences, or one with commas.

| Written | Read |
|---|---|
| Full — adding another is refused. | Full. Adding another is refused. |
| Every sign-in — and every refused one — is recorded. | Every sign-in, and every refused one, is recorded. |

The same goes for semicolons, "simply", "please note", and a first clause that only introduces the
second. They read as drafted rather than written.

## Arabic

- **Write the Arabic first and plainly**, in simple modern standard Arabic, not translated from an
  English sentence. Keep the technical words engineers use when there is no common Arabic one.
- Buttons are verbal nouns: «إضافة»، «حفظ»، «إرسال»، «حذف».
- A confirm title is a question: «هل تريد حذف هذا العميل؟»
- A danger-zone description says what happens, in the present: «حذفه يوقف وصوله فورًا، ويبقى سجله.»
- A Latin value inside an Arabic sentence is isolated so it keeps its order
  ([rtl-and-bidi.md](rtl-and-bidi.md#mixed-direction-text)).

## Lang files

An app with more than one language reads every string through `t()`
([composables.md](composables.md#usetranslations)); a one-language app may write its copy in
the templates.

- **Every key in every language**, in the same change. A missing key shows the raw key on screen.
- **Group by area, in a fixed order:** a file per area with `title`, `fields`, `actions`, `messages`,
  `errors`; words no area owns (Save, Cancel, Status) in `common`. An area never keeps its own copy of
  a `common` word.
- **Keys are `snake_case`**; values are whole sentences with `:placeholders`. Never glue two keys into
  one sentence: Arabic word order differs.
- **A count is a label and the number** (`'rows' => 'Rows: :count'`), which reads right for every
  number in both languages, instead of a sentence that needs plural forms.
- **The Form Request reads the same keys** as the page (`attributes()`, `messages()`), so the label
  above a field and the word inside its error are one key.
- **Enum labels and validation messages are translated on the server** and arrive in props or errors;
  Vue never builds an enum key.
- **A key built from a variable** is fine only for a closed set in a group of its own
  (`` t(`invoices.kinds.${kind}`) ``).
- **Share only the files the UI reads.** Every shared prop rides on every response.

## Self-check

- [ ] Buttons are verbs; labels in titled cards are bare.
- [ ] Help one sentence; empty state names the next action; no subtitle restating the table.
- [ ] No em dashes or semicolons; descriptions end with a period, titles do not.
- [ ] Confirm title is a question about the effect; description gives the consequence.
- [ ] Every key in every language; no glued sentences.
