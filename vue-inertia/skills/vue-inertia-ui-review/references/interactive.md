# Interactive widgets

**Read when:** a page has controls whose look depends on state: toggles, choices, gated buttons,
steppers, tabs, menus, filters, editable rows.
**Owns:** how to drive a control through each of its states and what each state must show.

## TL;DR

- A screenshot of the first state proves the first state. Drive every control through each state
  and shoot each one, in both themes and both directions.
- Hold an element handle when a control changes its own label; a text locator goes stale.
- Disabled, selected, busy, error and empty are states too, and each needs to be readable in dark.
- Keyboard paths count: Tab reaches the control, Enter or Space works it, Escape closes what opened.
- Reload after a change that should persist (a filter, a column choice) and check it survived.

Snippets assume the `page` from SKILL.md, "Probing a page yourself".

## The states to walk

For each control, list its states before clicking, then shoot each:

| Control | States |
|---|---|
| Button | idle, hover, focus, busy (spinner, disabled), disabled with a reason |
| Toggle, switch, checkbox | off, on, disabled, indeterminate (a "select all" with some rows picked) |
| Choice (radio group, segmented control, option list) | none picked, one picked, locked after submit |
| Gated action | locked until a condition holds, unlocked, after it runs |
| Tabs | each tab, a tab with an error marker, a deep link to a tab |
| Menu, dropdown, select, combobox | closed, open, an item highlighted, a long list scrolling, no match |
| Stepper or wizard | each step, Back keeps what was entered, the last step's action, a step with an error |
| Filter bar | empty, one filter, several, a filter with no results, cleared |
| Editable rows | one row, many rows, add, duplicate, remove the last one, an invalid cell |
| List or table | empty, one row, a full page, the last page, a long value in a cell |

## A control that changes its own label

A text locator re-resolves after the label changes and then finds nothing, or a different element.
Hold the element instead:

```js
const button = await page.getByRole('button', { name: 'Show details' }).elementHandle();
const before = await button.textContent();
await button.click();
await page.waitForTimeout(200);
console.log(before, '->', await button.textContent());
```

## A choice that locks after a pick

After a pick, read each option's state rather than trusting the look:

```js
const options = page.getByRole('radio');
await options.first().click();
for (let i = 0; i < await options.count(); i++) {
  const o = options.nth(i);
  console.log(await o.textContent(), {
    checked: await o.getAttribute('aria-checked'),
    disabled: await o.isDisabled(),
    opacity: await o.evaluate((el) => getComputedStyle(el).opacity),
  });
}
```

Check that the picked option stays readable when the group is disabled afterwards: a disabled style
that dims everything also dims the answer the user needs to see.

## An action gated on a condition

```js
const submit = page.getByRole('button', { name: 'Continue' });
console.log('disabled before:', await submit.isDisabled());
await page.getByLabel('I have read the terms').check();
console.log('disabled after:', await submit.isDisabled());
```

A disabled button gives no feedback on click, so the reason it is disabled must be visible (a hint,
a counter, a highlighted missing field).

## Toggles and checkboxes

```js
const toggle = page.getByRole('switch').first();
console.log('before', await toggle.getAttribute('aria-checked'));
await toggle.click();
console.log('after', await toggle.getAttribute('aria-checked'));
```

- The thumb stays inside its track in RTL; a transform-based thumb often runs out of it.
- A toggle that saves at once shows it saved (a toast or an inline mark) and rolls back on failure.
- A label next to it is clickable and toggles it too.

## Steppers and wizards

Walk with "Next" until every step type has been seen, and shoot each. Then:

- go Back from the last step: every value entered is still there;
- reload in the middle: the app either restores the step or starts over cleanly, never half;
- submit a step with an error: the step indicator marks it, and focus lands on the first error.

## Menus, selects and poppers

```js
await page.getByRole('combobox').first().click();
const listbox = page.getByRole('listbox');
console.log('open:', await listbox.isVisible(), 'box:', await listbox.boundingBox());
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Escape');
console.log('closed:', !(await listbox.isVisible()));
```

- The popper opens inside the viewport at phone width and on the correct side in RTL.
- A long list scrolls inside the popper, not the page.
- A search box in a combobox shows an empty state when nothing matches.
- Focus returns to the trigger on close.

## Keyboard

Tab through the page once in each direction:

```js
for (let i = 0; i < 15; i++) {
  await page.keyboard.press('Tab');
  console.log(await page.evaluate(() => {
    const el = document.activeElement;
    return `${el.tagName} ${el.getAttribute('aria-label') ?? el.textContent.trim().slice(0, 30)}`;
  }));
}
```

The order follows the reading order (right to left in Arabic), every stop has a visible focus ring
in both themes, and nothing hidden (a closed menu, an off-screen drawer) takes focus.

## Saved state

A choice the app remembers (visible columns, a collapsed sidebar, a page size, a draft) is kept in
localStorage, a cookie or the URL. Change it, reload, and check it came back; then clear it and check
the default is sane.

```js
console.log(await page.evaluate(() => ({ ...localStorage })));
```
