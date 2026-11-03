/*
 * Sweep a rendered page for what a text search cannot see.
 *
 * Paste the body of this file into a browser tool's JavaScript evaluator
 * against a loaded, rendered page. It is written as one expression so an
 * evaluator with REPL semantics returns the result directly.
 *
 * It answers four questions that have each produced a false "all clean":
 *   1. did the app actually mount? (an empty page sweeps clean)
 *   2. what Latin prose is left in the rendered text?
 *   3. what Latin is hiding in attributes innerText cannot see?
 *   4. are there stray one- or two-letter Latin strings (hardcoded initials)?
 * plus horizontal overflow, the cheapest RTL smoke test there is.
 *
 * Everything it returns still needs judgement: SQL keywords, table names,
 * engine names and the brand are meant to stay Latin.
 */

(async () => {
    await new Promise((r) => setTimeout(r, 2000));

    const root = document.querySelector('main') || document.body;
    const mounted = {
        appHasChildren: (document.getElementById('app')?.children.length ?? 0) > 0,
        textLength: document.body.innerText.length,
    };

    // A page that did not mount sweeps clean and tells you nothing. Most often
    // the asset dev server is unreachable from the browser tool.
    if (!mounted.textLength) {
        return JSON.stringify(
            { mounted, warning: 'Nothing rendered — do not trust a clean sweep.' },
            null,
            1,
        );
    }

    const text = root.innerText;

    const latinRuns = [
        ...new Set(
            (text.match(/[A-Za-z][A-Za-z ,'’.()\/-]{4,90}/g) || []).map((s) =>
                s.trim(),
            ),
        ),
    ];

    const attributes = [];
    for (const el of root.querySelectorAll('*')) {
        for (const name of ['placeholder', 'aria-label', 'title', 'alt']) {
            const value = el.getAttribute(name);
            if (value && /[A-Za-z]{3}/.test(value)) {
                attributes.push(`${name}="${value}"`);
            }
        }
    }

    const initials = [
        ...new Set(
            [...root.querySelectorAll('*')]
                .filter(
                    (el) =>
                        !el.children.length &&
                        /^[A-Za-z]{1,2}$/.test(el.textContent.trim()),
                )
                .map((el) => el.textContent.trim()),
        ),
    ];

    return JSON.stringify(
        {
            url: location.pathname,
            lang: document.documentElement.lang,
            dir: document.documentElement.dir,
            mounted,
            overflow:
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth,
            latinRuns,
            attributes: [...new Set(attributes)],
            initials,
        },
        null,
        1,
    );
})();
