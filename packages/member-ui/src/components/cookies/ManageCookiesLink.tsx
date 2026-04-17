'use client'

/**
 * ManageCookiesLink — small client-island button for footers.
 *
 * Dispatches a `vlp:open-cookie-prefs` custom event when clicked,
 * which CookieConsent listens for to re-open the preferences panel.
 *
 * Use in MarketingFooter (or any other footer-like surface) to give
 * returning visitors a way to change their cookie choices.
 */

const CUSTOM_EVENT = 'vlp:open-cookie-prefs'

export function ManageCookiesLink() {
  function handleClick() {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sm text-left text-text-muted hover:text-brand-primary transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
    >
      Manage cookies
    </button>
  )
}
