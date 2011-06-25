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

        var me = function(a) {
            return Bfuture.bfuture(function(passCallback, failCallback) {
                f(a, passCallback, failCallback);
            });
        };

        return me;
    };

    var identity = bsync(function(a, ifPass, _) {
        ifPass(a);
    });

    var faildentity = bsync(function(a, _, ifFail) {
        ifFail(a);
    });

    var constantFail = function(v) {
        return bsync(function(_, __, ifFail) {
            ifFail(v);
        });
    };

    var sync = function(f) {
        return bsync(function(a, ifPass, _) {
            ifPass(f(a));
        });
    };

    api.bsync = bsync;
    api.sync = sync;
    api.identity = identity;
    api.faildentity = faildentity;
    api.constantFail = constantFail;
});

