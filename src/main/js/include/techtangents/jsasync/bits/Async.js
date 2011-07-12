Ephox.core.module.define("techtangents.jsasync.bits.Async", [], function(api) {

    var create = function(executor, synchronizer) {

        /** data Async = Async { apply :: a -> (b -> ()) -> () }
         *  An Async represents an asynchronous computation. It is an augmented function and forms an arrow.
         */

        var Util   = techtangents.jsasync.util.Util;
        var Future = techtangents.jsasync.bits.Future.create(executor, synchronizer);

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

            // TODO test
            me.toPassBsync = function() {
                return Bsync.bsync(function(a, passCb, _) {
                    me(a)(passCb);
                });
            };

            // TODO test
            // TODO refactor against his friend
            me.toFailBsync = function() {
                return Bsync.bsync(function(a, _, failCb) {
                    me(a)(failCb);
                });
            };

            // TODO compose and chain could do with a few more tests

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
        var sync = ak(function(f, a, callback) {
            callback(f(a));
        });

        /** constant :: b -> Async a b */
        var constant = Util.compose(sync)(Util.konst);

        // TODO function to compose/chain an array of Asyncs

        return {
            async: async,
            sync: sync,
            constant: constant
        };
    };

    api.create = create;
});