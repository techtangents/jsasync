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

        // TODO: validate input?

        // A Bfuture p f is implemented in terms of a Future (Either p f)
        var fut = Future.future(function(callback) {
            f(function(p) {
                callback(Either.good(p));
            }, function(f) {
                callback(Either.bad(f));
            });
        });

        var me = function(passCb, failCb) {
            fut(Either.foldOn(passCb, failCb));
        };

        /** this Bfuture a f -> (a -> b) -> Bfuture b f */
        me.map = function(mapper) {
            return bfuture(function(passCb, failCb) {
                var eiMap = function(either) {
                    return either.map(mapper);
                };
                fut.map(eiMap)(Either.foldOn(passCb, failCb));
            });
        };
        me["<$>"] = me.map;

        /** this Bfuture a f -> (a -> Bfuture b f) -> Bfuture b f
         *  Note: a Bsync a f is an (a -> Bfuture b f)
         */
        me.bind = function(binder) {
            return bfuture(function(passCb, failCb) {
                me(function(p) {
                    binder(p)(passCb, failCb);
                }, failCb);
            });
        };
        me[">>="] = me.bind;

        /** bindAnon :: this Bfuture a f -> Bfuture b f -> Bfuture b f
         *  Note: (this Bfuture a) is strict - it is evaluated and the result discarded.
         *  This allows side effects to be chained.
         */
        // TODO test
        me.bindAnon = function(futureB) {
            return me.bind(function(_) {
                return futureB;
            });
        };
        me[">>"] = me.bindAnon;

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
    };

    api.constant = constant;
    api.constantFail = constantFail;
    api.bfuture = bfuture;
});