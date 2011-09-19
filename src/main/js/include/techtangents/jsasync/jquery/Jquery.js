Ephox.core.module.define("techtangents.jsasync.jquery.Jquery", [], function(api) {

    var create = function(executor, synchronizer) {

        var Bsync = techtangents.jsasync.bits.Bsync.create(executor, synchronizer);

        /** ajax :; String -> Bfuture AjaxPass AjaxFail */
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

        var getDataProperty = function(ajaxPass) {
            return ajaxPass.data;
        };

        var getFriendlyError = function(ajaxFail) {
            return "HTTP " + ajaxFail.jqXHR.status + ": " + ajaxFail.errorThrown;
        };

        /** ajaxSimple :: String -> Bfuture String         String
                          url               response text  error text
        */
        var ajaxSimple = ajax.map(getDataProperty).mapFail(getFriendlyError);

        return {
            ajax: ajax,
            ajaxSimple: ajaxSimple
        };
    };

    api.create = create;
});