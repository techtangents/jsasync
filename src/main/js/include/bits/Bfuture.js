Ephox.core.module.define("techtangents.jsasync.bits.Bfuture", [], function(api, _private) {

    var create = function(executor) {

        /** data Bfuture p f :: Bifuture { apply :: (p -> (), f -> ()) -> () };
         *  A Bfuture represents the result of an asynchronous computation which may pass or fail
         *  When invoking a Bfuture, a pass callback and fail callback are passed in.
         *  When the computation is complete, one of the callbacks is called, depdending on the result.
         */

        var Bpicker = techtangents.jsasync.util.Bpicker;
        var Either  = techtangents.jsasync.util.Either;
        var Util    = techtangents.jsasync.util.Util;

        var bf = function(f) {
            return function(x) {
                return bfuture(function(passCb, failCb){
                    f(x, passCb, failCb);
                });
            };
        };

        /** bfuture :: ((p -> (), f -> ()) -> ()) -> Bfuture p f */
        var bfuture = function(f) {

            // TODO: validate input?
            var me = executor(f);

            /** this Bfuture a f -> (a -> b) -> Bfuture b f */
            me.map = bf(function(mapper, passCb, failCb) {
                me(Util.compose(passCb)(mapper), failCb);
            });
            me["<$>"] = me.map;

            /** this Bfuture a f -> (a -> Bfuture b f) -> Bfuture b f
             *  Note: a Bsync a f is an (a -> Bfuture b f)
             */
            me.bind = bf(function(binder, passCb, failCb) {
                me(function(p) {
                    binder(p)(passCb, failCb);
                }, failCb);
            });
            me[">>="] = me.bind;

            /** bindAnon :: this Bfuture a f -> Bfuture b f -> Bfuture b f
             *  Note: (this Bfuture a f) is strict - it is evaluated and the result discarded.
             *  This allows side effects to be chained.
             */
            me.bindAnon = Util.compose(me.bind)(Util.konst);
            me[">>"] = me.bindAnon;

            /** toFutureEither :: this Bfuture p f -> Future (Either p f) */
            me.toFutureEither = function() {
                return Future.future(function(callback) {
                    var cb = Util.compose(callback);
                    f(cb(Either.good), cb(Either.bad));
                });
            };

            return me;
        };

        /** Compose an array of futures.
         *  par :: [Bfuture p f] -> Bfuture [a] [Either p f]
         */
        var par = function(futures) {
            return bfuture(function(passCb, failCb) {
                var feithers = Util.arrayMap(futures, function(fut) {
                    return fut.toFutureEither();
                });
                Future.par(feithers)(function(results) {
                    var goods = Either.goods(results);
                    var weWin = results.length === goods.length;
                    if (weWin) {
                        passCb(goods);
                    } else {
                        failCb(results);
                    }
                });
            });
        };

        var knst = function(picker) {
            return bf(function(a, passCb, failCb) {
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
            par: par
        };
    };

    api.create = create;
});