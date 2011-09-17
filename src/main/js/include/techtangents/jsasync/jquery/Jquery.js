Ephox.core.module.define("techtangents.jsasync.jquery.Jquery", [], function(api) {

    var create = function(executor, synchronizer) {

        var Bsync = techtangents.jsasync.bits.Bsync.create(executor, synchronizer);

        /** ajax :; AjaxOptions -> Bfuture AjaxPass AjaxFail */
        var ajax = Bsync.bsync(function(url, passCb, failCb) {
            jQuery.ajax(url, {
                success: function(data, textStatus, jqXHR) {
                    passCb({data: data, textStatus: textStatus, jqXHR: jqXHR});
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    failCb({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
                }
            });
        });

        return {
            ajax: ajax
        };
    };

    api.create = create;
});