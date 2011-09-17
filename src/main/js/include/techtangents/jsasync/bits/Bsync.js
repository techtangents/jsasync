Ephox.core.module.define("techtangents.jsasync.bits.Bsync", [], function(api) {

    var create = function(executor, synchronizer) {

        /** A Bsync represents an asynchronous computation which may "succeed" or "fail".
         *  Applying an argument to a Bsync generates a Bfuture.
         *  Invoking a BFuture results in either a pass or fail callback being called.
         *
         *  So, Async/Future has one callback, wheras Bsync/Bfuture has two callbacks.
         *
         *  Bsync a p f :: Bsync { apply :: (a, p -> (), f -> ()) -> () }
         */

        var j       = techtangents.jsasync;
        var Util    = j.util.Util;
        var Either  = j.util.Either;
        var Bpicker = j.util.Bpicker;

        var Bfuture = j.bits.Bfuture.create(executor, synchronizer);
        var Future = j.bits.Future.create(executor, synchronizer);

        var bs = Util.curry(function(f, x) {
            return bsync(function(a, passCb, failCb){
                f(x, a, passCb, failCb);
            });
        });

        /** bsync :: (a, p -> (), f -> ()) -> () -> Bsync a p f
         *  bsync(function(a, passCb, failCb){});
         */
        var bsync = function(f) {
            var me = Bfuture.bfut(f);

            /** compose :: Bsync b c f -> Bsync a b f -> Bsync a c f */
            var compose = function(bcf) {
                return bs(function(abf, a, passCb, failCb) {
                    abf(a)(function(b) {
                        bcf(b)(passCb, failCb);
                    }, failCb);
                });
            };

            /** chain :: Bsync a b f -> Bsync b c f -> Bsync a c f */
            var chain = Util.flip(compose);

            /** compose/<<< :: this Bsync b c f -> Bsync a b f -> Bsync a c f */
            me.compose = me["<<<"] = compose(me);

            /** chain/>>> :: this Bsync a b f -> Bsync b c f -> Bsync a c f */
            me.chain = me[">>>"] = chain(me);

            /** map :: this Bsync a b f -> (b -> c) -> Bsync a c f */
            me.map = me[">>^"] = me["<$>"] = Util.compose(me[">>>"])(sync);

            /** mapIn :: this Bsync b c f -> (a -> b) -> Bsync a c f */
            me.mapIn = me["<<^"] = bs(function(fab, a, passCb, failCb) {
                me(fab(a))(passCb, failCb);
            });

            /** mapFail :: this Bsync a b f -> (f -> g) -> Bsync a b g */
            me.mapFail = me["<!>"] = bs(function(mapper, a, passCb, failCb) {
                me(a)(passCb, Util.compose(failCb)(mapper));
            });
            
            /** biMap :: this Bsync a b b -> (b -> c) -> Bsync a c c */
            me.biMap = me["<**>"] = bs(function(mapper, a, passCb, failCb) {
                var q = Util.chain(mapper);
                Util.mapArgs(q)(me(a))(passCb, failCb);
            });

            /** ap/<*> :: this Bsync a b f -> Bsync a (b -> c) f -> Bsync a c f
             *  Bsync * * f is an arrow, thus Bsync a * f is an applicative
             */
            me.ap = me["<*>"] = bs(function(abc, a, passCb, failCb) {
                me(a)(function(b) {
                    abc(a)(Util.compizzle(passCb)(b), failCb);
                }, failCb);
            });

            /** negate :: this Bsync a b f -> Bsync a f b */
            me.negate = bsync_(function(a, passCb, failCb) {
                me(a)(failCb, passCb);
            });

            var always = function(picker) {
                return bsync_(function(a, passCb, failCb) {
                    var cb = picker(passCb, failCb);
                    me(a)(cb, cb);
                });
            };

            /** alwaysPass :: this Bsync a b b -> Bsync a b f */
            me.alwaysPass = always(Bpicker.pass);

            /** alwaysFail :: this Bsync a b b -> Bsync a p b */
            me.alwaysFail = always(Bpicker.fail);

            /** mapInAsync :: this Bsync b p f -> Async a b -> Bsync a p f */
            me.mapInAsync = bs(function(aab, a, passCb, failCb) {
                aab(a)(function(b) {
                    me(b)(passCb, failCb);
                });
            });

            /** mapAsync :: this Bsync a b f -> Async b c -> Bsync a c f */
            me.mapAsync = bs(function(abc, a, passCb, failCb) {
                me(a)(function(b) {
                    abc(b)(passCb);
                }, failCb);
            });

            /** mapFailAsync :: this Bsync a p f -> Async f g -> Bsync a p g */
            me.mapFailAsync = bs(function(afg, a, passCb, failCb) {
                me(a)(passCb, function(f) {
                    afg(f)(failCb);
                });
            });

            /** biMapAsync :: this Bsync a b b -> Async b c -> Bsync a c c */
            me.biMapAsync = bs(function(abb, a, passCb, failCb) {
                var q = Util.flip(abb);
                Util.mapArgs(q)(me(a))(passCb, failCb);
            });

            /** amap :: this Bsync a p f -> [a] -> Bfuture [p] (Either p f) */
            me.amap = function(input) {
                var futures = Util.arrayMap(input, me);
                return Bfuture.par(futures);
            };

            return me;
        };

        var bsync_ = Util.curry0(bsync);

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
        var predicate = bs(function(pred, a, passCb, failCb) {
            (pred(a) ? passCb : failCb)(a);
        });

        var quain = Util.flip(Util.arrayFoldLeftOnMethod)(identity);

        /** chainMany :: [zero or more of the form: Bsync a b f, Bsync b c f, ..., Bsync y z f] -> Bsync a z f */
        var chainMany = quain(">>>");

        /** composeMany :: [zero or more of the form: Bsync y z f, Bsync x y f, ..., Bsync a b f] -> Bsync a z f */
        var composeMany = quain("<<<");

        return {
            bsync: bsync,
            bsync_: bsync_,
            sync: sync,
            syncFail: syncFail,
            identity: identity,
            faildentity: faildentity,
            constant: constant,
            constantFail: constantFail,
            predicate: predicate,
            chainMany: chainMany,
            composeMany: composeMany
        };
    };

    api.create = create;
});
