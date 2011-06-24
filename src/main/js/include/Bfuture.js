Ephox.core.module.define("techtangents.jsasync.Bfuture", [], function(api, _private) {
    /** data Bfuture p f :: Bifuture { apply :: (p -> (), f -> ()) -> () };
     *  A Bfuture represents the result of an asynchronous computation which may pass or fail
     *  When invoking a Bfuture, a pass callback and fail callback are passed in.
     *  When the computation is complete, one of the callbacks is called, depdending on the result.
    */

    var Either = techtangents.jsasync.Either;

    // FIX: test!
    // FIX: Figure out what type classes this should implement

    /** bfuture :: ((p -> (), f -> ()) -> ()) -> Bfuture p f */
    var bfuture = function(f) {

        // A Bfuture p f is implemented in terms of a Future (Either p f)
        var fut = Future.future(function(callback) {
            f(function(p) {
                callback(Either.good(p));
            }, function(f) {
                callback(Either.bad(f));
            });
        });

        var me = function(passCallback, failCallback) {
            fut(function(either) {
                either.fold(passCallback, failCallback);
            });
        };

        /** this Bfuture p f -> p -> Bfuture p' f */
        me.bind = function(binder) {
            return bfuture(function(passCb, failCb) {
                me(function(p) {
                    binder(p)(passCb, failCb);
                }, function(f) {
                    failCb(f);
                });
            });
        };

        return me;
    };

    var constant = function(a) {
        return bfuture(function(passCb, failCb) {
            passCb(a);
        });
    };

    api.constant = constant;
    api.bfuture = bfuture;
});