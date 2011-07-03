Ephox.core.module.define("techtangents.jsasync.bits.Async", [], function(api) {

    /** data Async = Async { apply :: a -> (b -> ()) -> () }
     *  An Async represents an asynchronous computation. It is an augmented function and forms an arrow.
     */

    var Util   = techtangents.jsasync.util.Util;
    var Future = techtangents.jsasync.bits.Future;

    /** async :: (a -> (b -> ()) -> a -> Async a b
     *  Creates an Async from an asynchronous function(a, callback)
     */
    var async = function(f) {
        var me = function(a) {
            return Future.future(function(callback) {
                f(a, callback);
            });
        };

        /** mapIn :: this Async b c -> (a -> b) -> Async a c */
        me.mapIn = function(mapper) {
            return Async.async(function(b, callback) {
                me(mapper(b))(callback);
            });
        };
        me["<<^"] = me.mapIn;

        /** mapOut :: this Async a b -> (b -> c) -> Async a c */
        me.mapOut = function(mapper) {
            return Async.async(function(a, callback) {
                me(a)(Util.compose(callback)(mapper));
            });
        };
        me[">>^"] = me.mapOut;

        // TODO compose and chain could do with a few more tests

        /** compose :: Async b c -> Async a b -> Async a c */
        var compose = function(bc) {
            return function(ab) {
                return Async.async(function(a, callback) {
                    ab(a)(Util.flip(bc)(callback));
                });
            };
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

    /** constant :: b -> Async a b */
    var constant = Util.compose(sync)(Util.konst);

    api.async = async;
    api.sync = sync;
    api.constant = constant;

});