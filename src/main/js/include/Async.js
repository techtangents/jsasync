Ephox.core.module.define("techtangents.jsasync.Async", [], function(api) {

    /** data Async = Async { apply :: a -> (b -> ()) -> () }
     *  An Async represents an asynchronous computation. It is an augmented function and forms an arrow.
     */

    var Util = techtangents.jsasync.Util;
    var Future = techtangents.jsasync.Future;

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

        /** "Normal" Right-to-Left composition:  f . g == \x -> f(g(x))
         *  In a standard function, this would be: compose(f, g)(x) == f(g(x));
         *  In an async function, it is:
         *   compose(f, g) = function(x, callback) {
         *     return f(a, function(b) {
         *          g(b, callback);
         *     }
         *   }
         */
        var composeR = function(bc, ab) {
            return Async.async(function(a, callback) {
                ab(a)(function(b) {
                    bc(b)(callback);
                });
            });
        };

        /** Left-to-Right composition.
         *  let a ===> f mean "pass a to f" i.e. f(a)
         *  then chain(f, g) = \x -> x ===> f ===> g
         *  also chain(f, g) = g(f(x))
         *  composeRight :: this Async b c -> Async a b -> Async a c
         */
        var composeL = Util.flipUncurried(composeR);

        /** composeR :: this Async a b -> Async b c -> Async a c */
        me.composeR = function(other) {
            return chain(me, other);
        };
        me.compose = me.composeR;
        me["<<<"] = me.composeR;

        /** composeL :: this Async b c -> Async a b -> Async a c
         *  TIP! To "chain" Asyncs together, use this syntax:
         *  var asyncAD = (ab) [">>>"] (bc) [">>>"] (cd);
         *  var asyncAd = ab.compose(bc).compose(cd);
         */
        me.composeL = function(other) {
            return composeL(me, other);
        };
        me.chain = me.composeL;
        me[">>>"] = me.composeL;

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
    var constant = function(x) {
        return sync(Util.konst(x));
    };

    api.async = async;
    api.sync = sync;
    api.constant = constant;

});