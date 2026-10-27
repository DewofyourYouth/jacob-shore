/*
 * Mailing-list signup forms (layouts/_partials/subscribe-form.html).
 * Included once per form instance, so binding is idempotent. Submits to the
 * Brevo form in the form's action (with ?isAjax=1) so the reader stays on the page.
 *
 * GA4 events (all carry form_location = the form's data-source):
 *   subscribe_view   form scrolled into view (once per page load)
 *   subscribe_start  first focus on the email field
 *   sign_up          Brevo accepted the address (method "newsletter", double_opt_in);
 *                    it becomes a subscriber after the confirmation click
 *   subscribe_error  error_type: validation | server | network
 */
(function () {
  function track(name, params) {
    if (window.siteTrack) window.siteTrack(name, params);
    else if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  function showStatus(el, ok, msg) {
    el.textContent = msg;
    el.className = ok
      ? 'mt-4 text-sm px-4 py-3 rounded-[2px] border border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400'
      : 'mt-4 text-sm px-4 py-3 rounded-[2px] border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400';
  }

  function bind(form) {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';

    var btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector('[data-subscribe-status]');
    var label = form.dataset.buttonLabel || btn.textContent;
    var where = { form_location: form.dataset.source || '' };
    function fail(type, msg) {
      showStatus(status, false, msg);
      track('subscribe_error', Object.assign({ error_type: type }, where));
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) {
          track('subscribe_view', where);
          io.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(form);
    }

    form.elements.EMAIL.addEventListener('focus', function () {
      track('subscribe_start', where);
    }, { once: true });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.elements.EMAIL.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fail('validation', 'Please enter a valid email address.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Subscribing…';
      status.className = 'hidden';

      fetch(form.action + '?isAjax=1', { method: 'POST', body: new FormData(form) })
        .then(function (res) {
          return res.json().catch(function () { return { success: res.ok }; });
        })
        .then(function (data) {
          if (data && data.success) {
            showStatus(status, true, 'Almost there — check your inbox and click the link to confirm.');
            track('sign_up', Object.assign({ method: 'newsletter', double_opt_in: true }, where));
            form.reset();
          } else {
            fail('server', "That didn't go through. Check the address and try again.");
          }
        })
        .catch(function () {
          fail('network', 'Network error. Please check your connection and try again.');
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }

  function init() {
    document.querySelectorAll('form[data-subscribe]').forEach(bind);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
