Ephox.core.module.define("techtangents.jsasync.bits.Async", [], function(api) {

    var create = function(executor, synchronizer) {

        /** data Async = Async { apply :: a -> (b -> ()) -> () }
         *  An Async represents an asynchronous computation. It is an augmented function and forms an arrow.
         */

        var Util    = techtangents.jsasync.util.Util;
        var Bpicker = techtangents.jsasync.util.Bpicker;

        var Future  = techtangents.jsasync.bits.Future.create(executor, synchronizer);

        var ak = function(f) {
            return function(x) {
                return async(function(a, callback) {
                    f(x, a, callback);
                });
            };
        };

        /** async :: (a -> (b -> ()) -> a -> Async a b
         *  Creates an Async from an asynchronous function(a, callback)
         */
        var async = function(f) {
            var me = function(a) {
                return Future.future(function(callback) {
                    f(a, callback);
                });
            };

            /** mapIn/<<^ :: this Async b c -> (a -> b) -> Async a c */
            me.mapIn = me["<<^"] = ak(function(mapper, b, callback) {
                me(mapper(b))(callback);
            });

            /** map/>>^/<$> :: this Async a b -> (b -> c) -> Async a c */
            me.map = me[">>^"] = me["<$>"] = ak(function(mapper, a, callback) {
                me(a)(Util.compose(callback)(mapper));
            });

            /** ap/<*> Async a b -> Async a (b -> c) -> Async a c */
            me.ap = me["<*>"] = ak(function(abc, a, callback) {
                me(a)(function(b) {
                    abc(a)(Util.compizzle(callback)(b));
                });
            });

            var toBsync = function(picker) {
                // bind late to avoid infinite recursion
                var Bsync = techtangents.jsasync.bits.Bsync.create(executor, synchronizer);
                return function() {
                    return Bsync.bsync(function(a, passCb, failCb) {
                        me(a)(picker(passCb, failCb));
                    });
                };
            };

            /** toPassBsync :: this Async a p -> Bsync a p f */
            me.toPassBsync = toBsync(Bpicker.pass);

            /** toFailBsync :: this Async a f -> Bsync a p f */
            me.toFailBsync = toBsync(Bpicker.fail);

            /** compose :: Async b c -> Async a b -> Async a c */
            var compose = function(bc) {
                return ak(function(ab, a, callback) {
                    ab(a)(Util.flip(bc)(callback));
                });
            };

            /** chain :: Async a b -> Async b c -> Async a c */
            var chain = Util.flip(compose);

            /** compose :: this Async b c -> Async a b -> Async a c */
            me.compose = compose(me);
            me["<<<"] = me.compose;

            /** chain :: this Async a b -> Async b c -> Async a c */
            me.chain = chain(me);
            me[">>>"] = me.chain;

            /** Returns a Future that performs this Async over each element of the input array.
             *  amap :: this Async a b -> [a] -> Future [b]
             */
            me.amap = function(input) {
                var futures = Util.arrayMap(input, me);
                return Future.par(futures);
            };

            return me;
        };

        /** sync :: (a -> b) -> Async a b */
        var sync = function(f) {
            return async(function(a, callback) {
                callback(f(a));
            });
        };

        /** identity :: Async a a */
        var identity = sync(Util.identity);

        /** constant :: b -> Async a b */
        var constant = Util.compose(sync)(Util.konst);

        var quain = Util.flip(Util.arrayFoldLeftOnMethod)(identity);

        /** chainMany :: [zero or more of the form: Bsync a b f, Bsync b c f, ..., Bsync y z f] -> Bsync a z f */
        var chainMany = quain(">>>");

        /** composeMany :: [zero or more of the form: Bsync y z f, Bsync x y f, ..., Bsync a b f] -> Bsync a z f */
        var composeMany = quain("<<<");

        return {
            async: async,
            sync: sync,
            constant: constant,
            identity: identity,
            chainMany: chainMany,
            composeMany: composeMany
        };
    };

    api.create = create;
});
