Ephox.core.module.define("techtangents.jsasync.bits.Bsync", [], function(api) {

    var create = function(executor) {

        /** A Bsync represents an asynchronous computation which may "succeed" or "fail".
         *  Applying an argument to a Bsync generates a Bfuture.
         *  Invoking a BFuture results in either a pass or fail callback being called.
         *
         *  So, Async/Future has one callback, wheras Bsync/Bfuture has two callbacks.
         *
         *  Bsync a p f :: Bsync { apply :: (a, p -> (), f -> ()) -> () }
         */

        var Util    = techtangents.jsasync.util.Util;
        var Either  = techtangents.jsasync.util.Either;
        var Bpicker = techtangents.jsasync.util.Bpicker;

        var Async   = techtangents.jsasync.bits.Async.create(executor);
        var Bfuture = techtangents.jsasync.bits.Bfuture.create(executor);

        // FIX: Figure out what type classes this should implement

        /** bsync :: (a, p -> (), f -> ()) -> () -> Bsync a p f */
        var bsync = function(f) {

            // A Bsync is implemented in terms of an Async (Either p f)
            var asy = Async.async(function(a, callback) {
                var doCb = Util.compose(callback);
                f(a, doCb(Either.good), doCb(Either.bad));
            });

            var me = function(a) {
                return Bfuture.bfuture(function(passCallback, failCallback) {
                    asy(a)(Either.foldOn(passCallback, failCallback));
                });
            };

            /** amap :: this Bsync a p f -> [a] -> Bfuture [p] (Either p f) */
            me.amap = function(input) {
                var futures = Util.arrayMap(input, me);
                return Bfuture.par(futures);
            };

            return me;
        };

        var syncer = function(pickCb) {
            return Util.compose(bsync)(function(f) {
                return function(a, ifPass, ifFail) {
                    pickCb(ifPass, ifFail)(f(a));
                };
            });
        };

        /** sync :: (a -> p) -> Bsync a p f */
        var sync = syncer(Bpicker.pass);

        /** syncFail :: (a -> f) -> Bsync a p f */
        var syncFail = syncer(Bpicker.fail);

        /** identity :: Bsync a a f */
        var identity = sync(Util.identity);

        /** faildentity :: Bsync f p f */
        var faildentity = syncFail(Util.identity);

        /** constant :: p -> Bsync a p f */
        var constant = Util.chainConst(sync);

        /** constantFail :: f -> Bsync a p f */
        var constantFail = Util.chainConst(syncFail);

        /** predicate :: (a -> Bool) -> Bsync a a a */
        var predicate = function(pred) {
            return Bsync.bsync(function(a, passCb, failCb) {
                (pred(a) ? passCb : failCb)(a);
            });
        };

        return {
            bsync: bsync,
            sync: sync,
            syncFail: syncFail,
            identity: identity,
            faildentity: faildentity,
            constant: constant,
            constantFail: constantFail,
            predicate: predicate
        };
    };

    api.create = create;
});
