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

        /** bsync :: (a, p -> (), f -> ()) -> () -> Bsync a p f
         *  bsync(function(a, passCb, failCb){});
         */
        var bsync = function(f) {
            var me = function(a) {
                return Bfuture.bfuture(function(passCb, failCb) {
                    f(a, passCb, failCb);
                });
            };

            // TODO :: lots of functions here

            /** compose/<<< :: Bsync b c f -> Bsync a b f -> Bsync a c f */
            var compose = function(bcf) {
                return function(abf) {
                    return Bsync.bsync(function(a, passCb, failCb) {
                        abf(a)(function(b) {
                            bcf(b)(passCb, failCb);
                        }, failCb);
                    });
                };
            };

            /** chain :: Bsync a b f -> Bsync b c f -> Bsync a c f */
            var chain = Util.flip(compose);

            /** chain/>>> :: this Bsync a b f -> Bsync b c f -> Bsync a c f */
            me.chain = chain(me);
            me[">>>"] = me.chain;

            /** compose/<<< :: this Bsync b c f -> Bsync a b f -> Bsync a c f */
            me.compose = compose(me);
            me["<<<"] = me.compose;

            /** map :: this Bsync a b f -> (b -> c) -> Bsync a c f */
            // TODO

            /** mapIn :: this Bsync b c f -> (a -> b) -> Bsync a c f */
            // TODO

            /** ap/<*> :: this Bsync a b f -> Bsync a (b -> c) f -> Bsync a c f
             *  Bsync * * f is an arrow, thus Bsync a * f is an applicative
             *  TODO ^^^ is this right?
             */

            /** mapFail :: this Bsync a b f -> (f -> g) -> Bsync a b g */
            // TODO

            /** negate :: this Bsync a b f -> Bsync a f b */
            // TODO

            /** alwaysPass :: this Bsync a b b -> Bsync a b f */
            // TODO

            /** alwaysFail :: this Bsync a b b -> Bsync a p b */
            // TODO

            /** mapInAsync :: this Bsync b p f -> Async a b -> Bsync a p f */
            // TODO

            /** mapAsyncPass :: this Bsync a b f -> Async b c -> Bsync a c f */
            // TODO

            /** mapAsyncFail :: this Bsync a p f -> Async f g -> Bsync a p g
            // TODO

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

        // TODO: function that composes/chains an array of Bsyncs

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
