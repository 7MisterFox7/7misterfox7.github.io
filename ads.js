(function () {
    function initLampaHook() {
        if (window.Lampa && Lampa.Player && Lampa.Player.listener) {
            $.ajaxTransport('+json', function (options) {
                if (/\/api\/ad\/get\/banner(?:[?#]|$)/.test(options.url)) {
                    return {
                        send: function (headers, complete) {
                            complete(200, 'OK', { json: { ad: [] } });
                        },
                        abort: function () {}
                    };
                }
            });

            var listener = Lampa.Player.listener;
            var originalSend = listener.send;
            var restore;

            listener.send = function (type, event) {
                if (restore && (type === 'create' || type === 'start' || type === 'external' || type === 'destroy')) {
                    restore();
                    restore = null;
                }

                var result = originalSend.apply(this, arguments);

                if (type === 'create' && event && event.data) {
                    var data = event.data;
                    var hadIptv = Object.prototype.hasOwnProperty.call(data, 'iptv');
                    var iptv = data.iptv;

                    restore = function () {
                        if (hadIptv) data.iptv = iptv;
                        else delete data.iptv;
                    };

                    data.iptv = true;
                    delete data.vast_url;
                    delete data.vast_msg;
                }

                return result;
            };
        } else {
            setTimeout(initLampaHook, 500);
        }
    }
    initLampaHook();
})();
