# SD form — inspection notes

**Subject:** Discovery-Call form embed
**SD URL (hosted):** `https://secure.virtuallaunch.pro/i/ReTQXUM2fTdFUSJ/S9KhbyEWEDLMFtY`
**Embed script:** `https://secure.virtuallaunch.pro/frm/21EGX5mk16QA6qVGj.js`
**Date:** 2026-05-08

---

## Crucial finding (read first)

The SD form embed is **rendered as a same-origin `<iframe>`**, not as inline DOM. The embed JS body, verbatim:

```js
(function(t,d,u,f,w,h,s){
  f=d.createElement(f);
  s=d.currentScript;
  f.setAttribute('allowtransparency', true);
  f.setAttribute('frameborder', 0);
  f.setAttribute('width', w);
  f.setAttribute('height', h);
  f.src = ['https:', '//', 'secure.virtuallaunch.pro', u].join('');
  s.parentNode.insertBefore(f, s);
  t.addEventListener('message', function(e) {
    e.data[0]==='r' && t.open.apply(t, e.data[1]);
  });
}(window,document,'/frm/21EGX5mk16QA6qVGj','iframe','100%','100%'));
```

→ Builds an `<iframe src="https://secure.virtuallaunch.pro/frm/21EGX5mk16QA6qVGj" width="100%" height="100%" frameborder="0" allowtransparency="true">`.

**Implications for `.tpp-form-sd` overrides:**

1. The current `.tpp-form-sd label`, `.tpp-form-sd .form-control`, `.tpp-form-sd .switchery`, `.tpp-form-sd .help-block`, `.tpp-form-sd .btn-primary`, etc. CSS rules **cannot affect the form's actual content** — they target descendants of the wrapper, but the iframe's document is a separate browsing context and its descendants are not styleable from the parent page (even on same origin, without explicit cross-frame scripting).
2. The visible discrepancy between the SD-hosted page and our preview is **not** an override-mismatch problem. It is an **iframe sizing** problem. The iframe is `height=100%` and the wrapper has no committed height, so the iframe collapses (held up only by `.tpp-form-embed { min-height: 200px }` — far too short for a 4-field + switchery + scheduling-card + submit form).
3. The Switchery widget visibility is similarly an iframe-content issue. SD's own page CSS renders the switchery; if it shows correctly on the SD-hosted page (per Principal's reference image), it will show correctly inside our iframe too — provided the iframe has enough height to display it.
4. There is no `postMessage`-based auto-resize handshake in the embed JS. The iframe will not size itself to its content; the parent page must commit a height.

The brand colour overrides (rose labels, rose-to-crimson submit gradient, rose focus ring) listed in `.tpp-form-sd` are also dead — those visible touches in the preview screenshots (when present) are coming from inside the iframe (i.e. SD's own theme), not from our overrides.

## 1. Outermost form container

- Cannot be inspected from outside the iframe.
- The iframe URL `/frm/21EGX5mk16QA6qVGj` returns dynamic Angular HTML; the live form DOM is built client-side and not available via static `curl`. (Verified: `curl` of the embed URL returns a generic SD shell with `<script type="text/ng-template">` blocks for the form-builder UI, not the public form render.)

## 2. Each labeled field group

- Same — inaccessible from outside the iframe. Cannot enumerate `form-group` / `field` / label / helper-text class names without a browser DevTools session connected to the iframe document.

## 3. Input fields

- Same — inaccessible.

## 4. Switchery toggle

- Same — inaccessible.
- Note: the `switchery` library is a known third-party widget (https://abpetkov.github.io/switchery/). SD's form renderer ships its own `switchery` CSS; the dimensions, positioning, thumb shadow, etc. are governed by SD's own stylesheet inside the iframe.

## 5. Submit button

- Same — inaccessible.

## 6. Scheduling/confirmation card

- Same — inaccessible.

---

## Delta — current `.tpp-form-sd` overrides vs reality

| Rule in current CSS | Effect |
|---|---|
| `.tpp-form-sd label / .control-label / legend` | **No effect** (targets iframe interior). |
| `.tpp-form-sd input / select / textarea / .form-control` (all variants) | **No effect**. |
| `.tpp-form-sd input::placeholder` | **No effect**. |
| `.tpp-form-sd input:focus` etc. | **No effect**. |
| `.tpp-form-sd .form-group / .field / .form-field` | **No effect**. |
| `.tpp-form-sd .switchery / .switchery > small` | **No effect**. |
| `.tpp-form-sd input[type="checkbox"]:checked + .switchery` | **No effect**. |
| `.tpp-form-sd .sd-switchery-wrapper` | **No effect**. |
| `.tpp-form-sd button / .btn-primary` | **No effect**. |
| `.tpp-form-sd .help-block / .form-text / small` | **No effect**. |
| `.tpp-form-sd .has-error input` etc. | **No effect**. |
| `.tpp-form-embed { min-height: 200px }` | **Active** — and is the proximate cause of the cramped render. Iframe collapses to ~200px, hiding all fields below the first. |

## Recommendation

The fix is **iframe sizing**, not CSS overrides:

1. Set a generous explicit min-height on the iframe wrapper (the discovery-call form needs roughly 1100–1300px to render its company-name field + helper text + switchery + first-name + last-name + email + scheduling card + submit without internal scrolling).
2. Target the iframe directly with a CSS rule that forces `width: 100%; min-height: <value>; display: block; border: 0;`.
3. Leave the dead `.tpp-form-sd` descendant overrides in place but understand they have no effect — or remove them in a follow-up cleanup pass. (Out of scope for this round; touching them risks breaking nothing visible.)
4. Brand-colour parity (rose labels, rose submit gradient) inside the iframe **must be solved on the SD side**, not on our end. SD's "form theme" / "form CSS" tab would need to be configured to use the rose palette. Flag for Jamie.
5. Switchery visibility is also an iframe-internal concern; if the SD-hosted page renders the switchery correctly (per the reference image), our iframe will too once tall enough to display the toggle row.
