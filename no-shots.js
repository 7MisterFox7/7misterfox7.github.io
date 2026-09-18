(function () {
  'use strict';

  window.plugin_shots_ready = true;

  if (typeof window.lampa_settings == 'undefined') {
    window.lampa_settings = {};
  }

  window.lampa_settings.services = false;

  function interceptShotsLoading() {
    if (typeof Lampa !== 'undefined' && Lampa.Utils && Lampa.Utils.putScriptAsync) {
      const original = Lampa.Utils.putScriptAsync;
      Lampa.Utils.putScriptAsync = function (items, complite, error, success, show_logs) {
        if (Array.isArray(items)) {
          items = items.filter(url => !url || !url.includes('/plugin/shots'));
        }
        return original.call(this, items, complite, error, success, show_logs);
      };
    }
  }

  if (typeof Lampa !== 'undefined') {
    interceptShotsLoading();
  } else {
    const checkLampa = setInterval(function () {
      if (typeof Lampa !== 'undefined') {
        interceptShotsLoading();
        clearInterval(checkLampa);
      }
    }, 10);

    setTimeout(function () {
      clearInterval(checkLampa);
    }, 1000);
  }

})();
