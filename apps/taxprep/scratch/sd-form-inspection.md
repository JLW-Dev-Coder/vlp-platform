# SD Form Inspection — Phase 6 Round 4 (corrected)

**Status:** Round 3's "form is iframe" finding was wrong. Superseded.

## What the embed actually renders

The SD embed JS injects HTML directly into the parent DOM — **no iframe**. Principal pulled `outerHTML` from the rendered embed:

```html
<div class="app-form-embed app-form-type-intake" id="FormEmbed_{random}-scope" data-scopevar="FormEmbed_{random}" template-url="/frm/21EGX5mk16QA6qVGj">
  <style id="{random}" formcss="">/* ~600 lines of SD CSS scoped to #FormEmbed_{random}-scope */</style>
  <script type="text/json64-template">{base64-config}</script>
  <div class="card" id="forms-form-wrapper">
    <div class="card-block forms-form-block">
      <form class="sd-form-submit ..." action="..." method="post">
        <div sd-form-group="..." class="form-group embed-group">
          <label for="field_...">Company Name</label>
          <div class="label-subtext">...</div>
          <input class="form-control" type="text" name="...">
          <div class="sd-switchery-wrapper active">
            <input type="checkbox" class="oscar-switch" id="toggleNotCompany">
            <span class="switchery switchery-small" style="...inline styles..."><small style="..."></small></span>
            <label for="toggleNotCompany">I'm not representing a Company</label>
          </div>
        </div>
        <div class="form-group animated-form-label embed-group">...First Name...</div>
        <div class="form-group animated-form-label embed-group">...Last Name...</div>
        <div class="form-group animated-form-label embed-group">...Primary Email...</div>
        <div sd-appointment-type-field class="appointment-intake-form-wrapper">
          <div class="row"><div class="col active">
            <div class="appointment-intake-form-field-block">
              <input class="btn btn-primary" type="button" value="Click to schedule an Appointment">
              <div>Confirm it! ⚡</div>
            </div>
          </div></div>
        </div>
        <div class="form-actions btn-list">
          <button type="submit" class="btn btn-primary btn-sm form-submit-button">Submit ↵</button>
        </div>
      </form>
    </div>
  </div>
</div>
```

## Implications for our overrides

1. The DOM is same-origin and reachable from `.tpp-form-sd` descendant selectors — round 3's `.tpp-form-sd iframe { ... }` rule was a no-op solving a phantom problem and has been removed.
2. SD's own scoped `<style>` tag uses `#FormEmbed_{random}-scope ...` and `body.branding-theme-mrclean ...` qualifiers — high specificity, requires `!important` on our overrides.
3. The Switchery toggle has `style="background-color: rgb(255, 255, 255); ..."` written inline by SD's JS. Overriding requires `!important` on `background` and `background-color`.
4. The selectors that matter: `.app-form-embed`, `#forms-form-wrapper`, `.card`, `.card-block`, `.forms-form-block`, `.form-group.embed-group`, `.form-group.animated-form-label`, `.label-subtext`, `.sd-switchery-wrapper(.active)`, `.switchery`/`.switchery-small`, `.appointment-intake-form-wrapper`, `.appointment-intake-form-field-block`, `.form-actions`, `.btn-list`, `.btn.btn-primary`, `button.form-submit-button`.

See `apps/taxprep/components/marketing/LandingPage.tsx` `<style>` block (`.tpp-form-sd` section) for the live override set.
