Ephox.core.module.define("techtangents.jsasync.Bsync", [], function(api) {

    /** A Bsync represents an asynchronous computation which may "succeed" or "fail".
     *  Applying an argument to a Bsync generates a Bfuture.
     *  Invoking a BFuture results in either a pass or fail callback being called.
     *
     *  So, Async/Future has one callback, wheras Bsync/Bfuture has two callbacks.
     *
     *  Bsync a p f :: Bsync { apply :: (a, p -> (), f -> ()) -> () }
     */

    var Util = techtangents.jsasync.Util;
    var Async = techtangents.jsasync.Async;
    var Either = techtangents.jsasync.Either;

    // FIX: test!
    // FIX: Figure out what type classes this should implement

    /** bsync :: (a, p -> (), f -> ()) -> () -> Bsync a p f */
    var bsync = function(f) {

        // A Bsync is implemented in terms of an Async (Either p f)
        var asy = Async.async(function(a, callback) {
            f(a, function(p) {
                callback(Either.good(p));
            }, function(f) {
                callback(Either.bad(f));
            });
        });

        var me = function(a) {
            var afut = asy(a);
            return Bfuture.bfuture(function(passCallback, failCallback) {
                afut(a)(function(either) {
                    either.fold(passCallback, failCallback);
                });
            });
        };

        return me;
    };

    api.bsync = bsync;
});

