Ephox.core.module.define("techtangents.jsasync.bits.Bfuture", [], function(api, _private) {

    var create = function(executor, synchronizer) {

        /** data Bfuture p f :: Bifuture { apply :: (p -> (), f -> ()) -> () };
         *  A Bfuture represents the result of an asynchronous computation which may pass or fail
         *  When invoking a Bfuture, a pass callback and fail callback are passed in.
         *  When the computation is complete, one of the callbacks is called, depdending on the result.
         */

        var Bpicker = techtangents.jsasync.util.Bpicker;
        var Either  = techtangents.jsasync.util.Either;
        var Util    = techtangents.jsasync.util.Util;

        var bfut = Util.curry(function(f, x) {
            return bfuture(function(passCb, failCb){
                f(x, passCb, failCb);
            });
        });

        /** bfuture :: ((p -> (), f -> ()) -> ()) -> Bfuture p f */
        var bfuture = function(f) {

            // TODO: validate input?
            var me = executor(f);

            /** this Bfuture a f -> (a -> b) -> Bfuture b f */
            me.map = me["<$>"] = bfut(function(mapper, passCb, failCb) {
                me(Util.compose(passCb)(mapper), failCb);
            });

            /** this Bfuture a f -> (a -> Bfuture b f) -> Bfuture b f
             *  Note: a Bsync a f is an (a -> Bfuture b f)
             */
            me.bind = me[">>="] = bfut(function(binder, passCb, failCb) {
                me(function(p) {
                    binder(p)(passCb, failCb);
                }, failCb);
            });

            /** bindAnon :: this Bfuture a f -> Bfuture b f -> Bfuture b f
             *  Note: (this Bfuture a f) is strict - it is evaluated and the result discarded.
             *  This allows side effects to be chained.
             */
            me.bindAnon = me[">>"] = Util.compose(me.bind)(Util.konst);

            /** toFutureEither :: this Bfuture p f -> Future (Either p f) */
            me.toFutureEither = Util.curry0(toFutureEither)(me);

            return me;
        };

        var toFutureEither = bfut(function(fut, callback) {
            var cb = Util.compose(callback);
            fut(cb(Either.good), cb(Either.bad));
        });

        /** Compose an array of futures.
         *  par :: [Bfuture p f] -> Bfuture [p] [Either p f]
         */
        var par = bfut(function(futures, passCb, failCb) {
            var feithers = Util.arrayMap(futures, toFutureEither);
            Future.par(feithers)(function(results) {
                var goods = Either.goods(results);
                if (results.length === goods.length) {
                    passCb(goods);
                } else {
                    failCb(results);
                }
            });
        });

        var knst = function(picker) {
            return bfut(function(a, passCb, failCb) {
                picker(passCb, failCb)(a);
            });
        };

        /** constant :: a -> Bfuture a f */
        var constant = knst(Bpicker.pass);

        /** constantFail :: f -> Bfuture a f */
        var constantFail = knst(Bpicker.fail);

        return {
            constant: constant,
            constantFail: constantFail,
            bfuture: bfuture,
            par: par,
            bfut: bfut
        };
    };

    api.create = create;
});