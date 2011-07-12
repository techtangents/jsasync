Ephox.core.module.define("techtangents.jsasync.bits.Future", [], function(api) {

    var create = function(executor, synchronizer) {

        /** data Future = Future { apply :: (b -> ()) -> () }
         *  A Future represents the future result of an asnchronous computation.
         *  A Future is an augmented function and a monad
         */

        var Util   = techtangents.jsasync.util.Util;
        var Ticker = techtangents.jsasync.util.Ticker;

        /** Creates a Future, given a function that takes a callback as its only argument.
         *
         *  future :: ((a -> ()) -> ()) -> Future a
         *  i.e. function(callback) { ...; callback(a); }; -> Future a
         */
        var future = function future(f) {

            /** (function application) :: this Future a -> (a => ()) -> () */
            var me = executor(f);

            /** map/<$> :: this Future a -> (a -> b) -> Future b */
            me.map = me["<$>"] = function(mapper) {
                return future(function(callback) {
                    me(Util.compose(callback)(mapper));
                });
            };

            /** bind/>>= :: this Future a -> (a -> Future b) -> Future b
             *  Note: an Async is an (a -> Future b)
             */
            me.bind = me[">>="] = function(aToFutureB) {
                return future(function(callback) {
                    me(function(a) {
                        aToFutureB(a)(callback);
                    });
                });
            };

            /** bindAnon :: this Future a -> Future b -> Future b
             *  Note: (this Future a) is strict - it is evaluated and the result discarded.
             *  This allows side effects to be chained.
             */
            me.bindAnon = me[">>"] = Util.compose(me.bind)(Util.konst);

            return me;
        };

        /** constant :: a -> Future a */
        var constant = function(x) {
            return future(function(callback) {
                callback(x);
            });
        };

        /** Compose an array of futures.
         *  par :: [Future a] -> Future [a]
         */
        var par = function(futures) {
            return future(function(callback) {
                var r = [];
                var tick = Ticker.create(synchronizer, futures.length, Util.curry0(callback)(r));
                var lock = {};
                Util.arrayEach(futures, function(fut, i) {
                    fut(synchronizer(lock, function(value) {
                        r[i] = value;
                        tick();
                    }));
                });
            });
        };

        return {
            future: future,
            constant: constant,
            par: par
        };
    };

    api.create = create;
});