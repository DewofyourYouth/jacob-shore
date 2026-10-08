/*
 * Mailing-list signup forms (layouts/_partials/subscribe-form.html).
 * Included once per form instance, so binding is idempotent.
 *
 * GA4 events (all carry form_location = the form's data-source):
 *   subscribe_view   form scrolled into view (once per page load)
 *   subscribe_start  first focus on the email field
 *   sign_up          successful submit (method "newsletter", double_opt_in)
 *   subscribe_error  error_type: validation | captcha | server | network
 */
(function () {
  var TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

  if (!document.querySelector('script[src^="' + TURNSTILE_SRC + '"]')) {
    var s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

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

  // Interaction-only Turnstile may still be solving when the button is
  // pressed, so give it a few seconds before giving up.
  function waitForToken(form, ms) {
    return new Promise(function (resolve) {
      var start = Date.now();
      (function poll() {
        var input = form.querySelector('input[name="cf-turnstile-response"]');
        if (input && input.value) return resolve(input.value);
        if (Date.now() - start > ms) return resolve('');
        setTimeout(poll, 200);
      })();
    });
  }

  function resetTurnstile(form) {
    var widget = form.querySelector('.cf-turnstile');
    if (window.turnstile && widget) {
      try { window.turnstile.reset(widget); } catch (e) {}
    }
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

    form.elements.email.addEventListener('focus', function () {
      track('subscribe_start', where);
    }, { once: true });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.elements.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fail('validation', 'Please enter a valid email address.');
        return;
      }

      var lists = Array.prototype.slice
        .call(form.querySelectorAll('input[name="lists"]'))
        .filter(function (i) { return i.type === 'hidden' || i.checked; })
        .map(function (i) { return Number(i.value); });
      if (form.querySelector('input[name="lists"][type="checkbox"]') && !lists.length) {
        fail('validation', 'Pick at least one topic.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Subscribing…';
      status.className = 'hidden';

      waitForToken(form, 5000)
        .then(function (token) {
          if (!token) throw new Error('captcha');
          return fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              lists: lists,
              source: form.dataset.source || '',
              company: form.elements.company ? form.elements.company.value : '',
              turnstileToken: token,
            }),
          });
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.ok) {
            showStatus(status, true, data.message || "You're on the list — thanks!");
            track('sign_up', Object.assign({
              method: 'newsletter',
              double_opt_in: !!data.doubleOptIn,
              list_count: lists.length || 1,
            }, where));
            form.reset();
          } else {
            fail('server', data.error || 'Something went wrong. Please try again.');
          }
        })
        .catch(function (err) {
          if (err && err.message === 'captcha') {
            fail('captcha', 'Still checking you are human — please try again in a moment.');
          } else {
            fail('network', 'Network error. Please check your connection and try again.');
          }
        })
        .finally(function () {
          resetTurnstile(form);
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
