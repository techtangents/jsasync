Ephox.core.module.define("techtangents.jsasync.Bfuture", [], function(api, _private) {
    /** data Bfuture p f :: Bifuture { apply :: (p -> (), f -> ()) -> () };
     *  A Bfuture represents the result of an asynchronous computation which may pass or fail
     *  When invoking a Bfuture, a pass callback and fail callback are passed in.
     *  When the computation is complete, one of the callbacks is called, depdending on the result.
    */

    var Either = techtangents.jsasync.Either;
    var wrap = techtangents.jsasync.Util.wrap;

    // FIX: test!
    // FIX: Figure out what type classes this should implement

    /** bfuture :: ((p -> (), f -> ()) -> ()) -> Bfuture p f */
    var bfuture = function(f) {

        // TODO: validate?
        var me = wrap(f);

        /** this Bfuture a f -> a -> Bfuture b f
         *  Note: a Bsync a f is an (a -> Bfuture b f)
         */
        me.bind = function(binder) {
            return bfuture(function(passCb, failCb) {
                me(function(p) {
                    binder(p)(passCb, failCb);
                }, failCb);
            });
        };

        return me;
    };

    var constant = function(a) {
        return bfuture(function(passCb, _) {
            passCb(a);
        });
    };

    var constantFail = function(a) {
        return bfuture(function(_, failCb) {
            failCb(a);
        });
    }

    api.constant = constant;
    api.constantFail = constantFail;
    api.bfuture = bfuture;
});