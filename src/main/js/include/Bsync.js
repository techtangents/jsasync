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
    var Bfuture = techtangents.jsasync.Bfuture;

    var curry1 = Util.curry1;
    var compose = Util.compose;

    // FIX: test!
    // FIX: Figure out what type classes this should implement

    /** bsync :: (a, p -> (), f -> ()) -> () -> Bsync a p f */
    var bsync = function(f) {

        // A Bsync is implemented in terms of an Async (Either p f)
        var asy = Async.async(function(a, callback) {
            var doCb = curry1(compose, callback);
            f(a, doCb(Either.good), doCb(Either.bad));
        });

        var me = function(a) {
            return Bfuture.bfuture(function(passCallback, failCallback) {
                asy(a)(function(either) {
                    either.fold(passCallback, failCallback);
                });
            });
        };
        return me;
    };

    /** constant :: p -> Bsync a p f */
    var constant = function(v) {
        return bsync(function(_, ifPass, __) {
            ifPass(v);
        });
    };

    /** constantFail :: f -> Bsync a p f */
    var constantFail = function(v) {
        return bsync(function(_, __, ifFail) {
            ifFail(v);
        });
    };

    /** sync :: (a -> p) -> Bsync a p f */
    var sync = function(f) {
        return bsync(function(a, ifPass, _) {
            ifPass(f(a));
        });
    };

    /** syncFail :: (a -> f) -> Bsync a p f */
    var syncFail = function(f) {
        return bsync(function(a, _, ifFail) {
            ifFail(f(a));
        });
    };

    /** identity :: Bsync a a f */
    var identity = bsync(function(a, ifPass, _) {
        ifPass(a);
    });

    /** faildentity :: Bsync f p f */
    var faildentity = bsync(function(a, _, ifFail) {
        ifFail(a);
    });

    api.bsync = bsync;
    api.sync = sync;
    api.syncFail = syncFail;
    api.identity = identity;
    api.faildentity = faildentity;
    api.constant = constant;
    api.constantFail = constantFail;
});

