(function () {
    var plugin = {
        name: 'NoAdServer',
        description: 'Отключение рекламного блока .ad-server',
        version: '1.0'
    };

    // --- моментально скрыть, даже если Lampa еще не загрузилась ---
    var style = document.createElement('style');
    style.innerHTML = `
        .ad-server,
        .ad-server * {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);


    function removeAds() {
        document.querySelectorAll('.ad-server').forEach(e => e.remove());
    }

    // удалить сразу если уже есть
    removeAds();

    // --- слежение, чтобы удалить сразу при появлении ---
    const observer = new MutationObserver(() => removeAds());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // событие Lampa (подстраховка)
    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', () => setTimeout(removeAds, 50));
    }

    if (window.Lampa && Lampa.Plugin) {
        Lampa.Plugin.create(plugin);
    }
})();