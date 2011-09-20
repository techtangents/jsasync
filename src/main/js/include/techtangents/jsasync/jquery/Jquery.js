Ephox.core.module.define("techtangents.jsasync.jquery.Jquery", [], function(api) {

    var objectMerge = techtangents.jsasync.util.Util.objectMerge;

    var create = function(executor, synchronizer) {

        var Bsync = techtangents.jsasync.bits.Bsync.create(executor, synchronizer);

        /** All options. Raw jquery return values.
            e.g. ajaxFull({datatype: "blah"})("myurl")(passCb, failCb)
            ajaxFull :; AjaxOptions -> String -> Bfuture AjaxPass AjaxFail
        */
        var ajaxFull = function(options) {
            return Bsync.bsync(function(url, passCb, failCb) {
                var noptions = objectMerge(options, {
                    success: function(data, textStatus, jqXHR) {
                        passCb({data: data, textStatus: textStatus, jqXHR: jqXHR});
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        failCb({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
                    }
                });
                jQuery.ajax(url, noptions);
            });
        };

        /** Default options. Raw jquery return values */
        var ajax = ajaxFull({});

        var getDataProperty = function(ajaxPass) {
            return ajaxPass.data;
        };

        var getFriendlyError = function(ajaxFail) {
            return "HTTP " + ajaxFail.jqXHR.status + ": " + ajaxFail.errorThrown;
        };

        /** Default options. Friendly return values.
            ajaxSimple :: String -> Bfuture String         String
                          url               response text  error text
        */
        var ajaxSimple = ajax.map(getDataProperty).mapFail(getFriendlyError);

        /** Full options. Friendly return values */
        var ajaxFullSimple = function(options) {
            return ajaxFull(options).map(getDataProperty).mapFail(getFriendlyError);
        };

        return {
            ajax: ajax,
            ajaxFull: ajaxFull,
            ajaxSimple: ajaxSimple,
            ajaxFullSimple: ajaxFullSimple
        };
    };

    api.create = create;
});