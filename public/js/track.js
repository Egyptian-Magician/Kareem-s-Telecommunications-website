/* ============================================================================
   Kar-Tel analytics + ad tracking — Google Analytics 4 + Meta (Facebook) Pixel
   ----------------------------------------------------------------------------
   HOW TO TURN IT ON:
     Fill in the two IDs below, then redeploy (push to main). While an ID is
     empty ('') that platform stays completely OFF — no script loads, no cookie
     is set, no network request is made. So this file is safe to ship blank.

     GA4_ID         Google Analytics 4 "Measurement ID". Looks like 'G-ABCD1234'.
                    Get it: analytics.google.com -> Admin -> Data streams -> your
                    web stream -> "Measurement ID" (top right).

     META_PIXEL_ID  Meta (Facebook) Pixel ID. A long number, e.g. '1234567890'.
                    Get it: business.facebook.com -> Events Manager -> Data
                    sources -> your Pixel -> the ID under its name.

   Neither ID is a secret — both appear in public page source, so committing
   them is fine (this does NOT violate the "never commit secrets" rule).

   WHAT IT TRACKS:
     - A page view on every page (once an ID is set).
     - A "Lead" conversion whenever a visitor clicks a CALL link (tel:) or an
       EMAIL link (mailto:) — i.e. every "Request a quote" / call CTA. That is
       the signal your Facebook ads optimize toward and measure.
   ========================================================================== */

(function () {
  // ==== EDIT THESE TWO LINES ================================================
  var GA4_ID = '';          // e.g. 'G-ABCD1234'  — leave '' to keep GA off
  var META_PIXEL_ID = '';   // e.g. '1234567890'  — leave '' to keep Pixel off
  // =========================================================================

  // ---- Google Analytics 4 -------------------------------------------------
  if (GA4_ID) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  // ---- Meta (Facebook) Pixel ----------------------------------------------
  if (META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // ---- Lead conversion on call / email CTAs -------------------------------
  // Delegated so it covers every current and future tel:/mailto: link.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var method =
      href.indexOf('tel:') === 0 ? 'call' :
      href.indexOf('mailto:') === 0 ? 'email' : null;
    if (!method) return;
    if (window.fbq) window.fbq('track', 'Lead', { content_name: method });
    if (window.gtag) window.gtag('event', 'generate_lead', { method: method });
  }, { passive: true });
})();
