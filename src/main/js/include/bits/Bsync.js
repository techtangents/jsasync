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

        var bs = function(f) {
            return function(x) {
                return bsync(function(a, passCb, failCb){
                    f(x, a, passCb, failCb);
                });
            };
        };

        /** bsync :: (a, p -> (), f -> ()) -> () -> Bsync a p f
         *  bsync(function(a, passCb, failCb){});
         */
        var bsync = function(f) {
            var me = function(a) {
                return Bfuture.bfuture(function(passCb, failCb) {
                    f(a, passCb, failCb);
                });
            };

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

            /** chain/>>> :: this Bsync a b f -> Bsync b c f -> Bsync a c f */
            me.chain = me[">>>"] = chain(me);

            /** compose/<<< :: this Bsync b c f -> Bsync a b f -> Bsync a c f */
            me.compose = me["<<<"] = compose(me);

            /** map :: this Bsync a b f -> (b -> c) -> Bsync a c f */
            me.map = me[">>^"] = me["<$>"] = Util.compose(me[">>>"])(sync);

            /** mapIn :: this Bsync b c f -> (a -> b) -> Bsync a c f */
            // TODO alias
            // TODO test
            // TODO is this Util.compose(me["<<<"])(sync) ?
            me.mapIn = me["<<^"] = bs(function(fab, a, passCb, failCb) {
                me(fab(a))(passCb, failCb);
            });

            /** ap/<*> :: this Bsync a b f -> Bsync a (b -> c) f -> Bsync a c f
             *  Bsync * * f is an arrow, thus Bsync a * f is an applicative
             */
            // TODO test
            me.ap = me["<*>"] = function(abc) {
                return bsync(function(a, passCb, failCb) {
                    me(a)(function(b) {
                        abc(a)(function(bc) {
                            passCb(bc(b));
                        }, failCb);
                    }, failCb);
                });
            };

            /** mapFail :: this Bsync a b f -> (f -> g) -> Bsync a b g */
            me.mapFail = me["<!>"] = bs(function(mapper, a, passCb, failCb) {
                me(a)(passCb, Util.compose(failCb)(mapper));
            });

            /** negate :: this Bsync a b f -> Bsync a f b */
            // TODO test
            me.negate = function() {
                return bsync(function(a, passCb, failCb) {
                    me(a)(failCb, passCb);
                });
            };

            var always = function(picker) {
                return function() {
                    return bsync(function(a, passCb, failCb) {
                        var cb = picker(passCb, failCb);
                        me(a)(cb, cb);
                    });
                };
            };

            /** alwaysPass :: this Bsync a b b -> Bsync a b f */
            me.alwaysPass = always(Bpicker.pass);

            /** alwaysFail :: this Bsync a b b -> Bsync a p b */
            me.alwaysFail = always(Bpicker.fail);

            /** mapInAsync :: this Bsync b p f -> Async a b -> Bsync a p f */
            // TODO test
            me.mapInAsync = function(aab) {
                return bsync(function(a, passCb, failCb) {
                    aab(a)(function(b) {
                        me(b)(passCb, failCb);
                    });
                });
            };

            /** mapAsyncPass :: this Bsync a b f -> Async b c -> Bsync a c f */
            // TODO test
            me.mapAsyncPass = function(abc) {
                return bsync(function(a, passCb, failCb) {
                    me(a)(function(b) {
                        abc(b)(passCb);
                    }, failCb);
                });
            };

            /** mapAsyncFail :: this Bsync a p f -> Async f g -> Bsync a p g */
            // TODO test
            me.mapAsyncFail = function(afg) {
                return bsync(function(a, passCb, failCb) {
                    me(a)(passCb, function(f) {
                        afg(f)(failCb);
                    });
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

        var quain = Util.flip(Util.arrayFoldLeftOnMethod)(identity);

        /** chainMany :: [zero or more of the form: Bsync a b f, Bsync b c f, ..., Bsync y z f] -> Bsync a z f */
        var chainMany = quain(">>>");

        /** composeMany :: [zero or more of the form: Bsync y z f, Bsync x y f, ..., Bsync a b f] -> Bsync a z f */
        var composeMany = quain("<<<");

        return {
            bsync: bsync,
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
