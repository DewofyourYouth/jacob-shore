/*
 * GA4 event helper (loaded site-wide from include/head_end.html).
 *
 *   window.siteTrack('sign_up', { method: 'newsletter' })
 *
 * Declarative tracking — any clickable element can carry:
 *   data-track="event_name" data-track-<param>="value" …
 * e.g. <a data-track="cta_click" data-track-cta="hire" data-track-location="hero">
 * (data-track-foo-bar becomes the GA param foo_bar).
 *
 * A page can fire an event on load with front matter `track_event: name`
 * (rendered as <meta name="track-event">).
 *
 * No-ops when gtag isn't present (local `hugo server`, Do Not Track, blockers).
 */
(function () {
  window.siteTrack = function (name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    } catch (e) {}
  };

  function paramsFrom(el) {
    var params = {};
    Object.keys(el.dataset).forEach(function (key) {
      if (key.indexOf('track') !== 0 || key === 'track') return;
      var name = key.slice(5).replace(/[A-Z]/g, function (c) { return '_' + c.toLowerCase(); }).replace(/^_/, '');
      params[name] = el.dataset[key];
    });
    if (el.href && !params.link_url) params.link_url = el.href;
    return params;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (el) window.siteTrack(el.dataset.track, paramsFrom(el));
  }, true);

  function onLoad() {
    var meta = document.querySelector('meta[name="track-event"]');
    if (meta && meta.content) window.siteTrack(meta.content, { page_path: location.pathname });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onLoad);
  else onLoad();
})();
