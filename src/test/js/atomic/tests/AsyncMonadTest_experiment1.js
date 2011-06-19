var fn1 = function(a, callback) {
    callback(a + "_a");
};

var fn2 = function(a, callback) {
    callback(a + "_b");
};

var Async = (function() {

    /** Lifts an async function into the Async monad
     *
     *  An async function is of the form: function(a, callback){ callback(b); }
     *  asnyc :: (a -> (b -> ())) -> Async a b x
     */
    var async = function async(fn) {

        // start :: this Async a b x -> (a -> (b -> ())) -> ()
        var start = fn;

        /** compose :: this Async a b -> Async b c -> Async a c
         */
        var compose = function(mb) {
            return async(function(a, callback) {
                fn(a, function(ra) {
                    mb.start(ra, callback);
                });
            });
        };

        // map :: this Async a b -> (b -> c) -> Async a c
        var map = function(g) {
            return async(function(a, callback) {
                fn(a, function(ra) {
                    callback(g(ra));
                });
            });
        };

        return {
            start: start,
            compose: compose,
            map: map
        };
    };

    /** Lifts a synchronous function into the Async monad
     *  A synchronous function is of the form function(a) { return b; }
     *  sync :: (a -> b) -> Async a b
     */
    var sync = function(fn) {
        return async(function(a, callback) {
            callback(fn(a));
        });
    };

    /** Lifts a constant value into the Async monad
     *  When this Async is started, the input is ignored.
     *  constant :: b -> Async a b
     */
    var constant = function(value) {
        return sync(function(_) {
            return value;
        });
    };

    return {
        async: async,
        sync: sync,
        constant: constant
    };
})();
