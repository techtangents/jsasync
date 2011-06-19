(function() {
    var global = (function() { return this; })();
    global.techtangents = global.techtangents || {};

    global.techtangents.async = (function() {

        function flip(f) {
            return function(a, b) {
                return f(b, a);
            };
        };

        function wrap(f) {
            return function() {
                f.apply(this, arguments);
            };
        };

        /**
         *  A future represents the result of an asynchronous computation. It is a function(callback){...} and a monad.
         *
         *  - As a function it is (a -> ()) -> ()
         *                   i.e. function(callback) { ...; callback(a); }; -> Future a
         *  - As an object it is a Monad
         *
         *  The function nature starts the computation, which terminates in the callback firing.
         *  Ideally this should only be invoked at the edge of the system.
         *
         *  Future can be created from:
         *  - single values
         *  - synchronous thunks: -> b  i.e. function() { return b; }
         *  - asynchronous functions b -> () -> () i.e. function(callback) { ...; callback(b); };
         */
        var Future = (function() {

            /**
             *  Creates a Future, given a function that takes a callback as its only argument.
             *
             *  future :: (a -> ()) -> () -> Future a
             *  i.e. function(callback) { ...; callback(a); }; -> Future a
             */
            var future = function future(f) {

                /** (function application) :: this Future a -> (a => ()) -> () */
                var me = wrap(f);

                /** map :: this Future a -> (a -> b) -> Future b */
                me.map = function(mapper) {
                    return future(function(callback) {
                        f(function(a) {
                            callback(mapper(b));
                        });
                    });
                };
                me["<$>"] = me.map;

                /** bind :: this Future a -> (a -> Future b) -> Future b
                 *  Note: an Async is an (a -> Future b)
                 */
                me.bind = function(aToFutureB) {
                    return future(function(callback) {
                        var a = me();
                        var futureB = aToFutureB(a);
                        futureB(callback);
                    });
                };
                me[">>="] = me.bind;
            };

            return {
                future: future
            }
        });


        /**
         *  An Async represents an asynchronous computation. It is an augmented function and forms a category.
         *
         *  The typical use case is to convert an asynchronous function to an Async.
         *  The asynchronous function is of two arguments: (a, callback) and this is converted to an Async, which is an
         *  equivalent function in curried form: (a)(callback).
         *
         *  You invoke an Async with a value 'a' to get a Future, which is also an augmented function.
         *  Invoke the Future with a callback, and the callback is invoked with the result.
         *
         *  Both the Async and the Future are functions augmented with category and monad capabilities respectively,
         *  in order to facilitate composition.
         *
         *  As a function, an Async is:       a -> Future b
         *  Expanding "Future b" gives us:    a -> (b -> ()) -> ()
         *  Thus an Async is a curried function.
         *   - given x :: Async a, then x(a)(callback) will perform the async computation on 'a' and invoke 'callback' with the result.
         *   - x(a)(function(b) { ... });
         *
         *  Asyncs can be created from:
         *  - single values (of type 'b' in the above type signatures. In this case, the argument 'a' is ignored)
         *  - synchronous functions a -> b  i.e. function(a) { return b; }
         *  - asynchronous functions (a, b -> ()) -> () i.e. function(a, callback) { ...; callback(b); };
         *
         *  Asynchronous functions with multiple non-callback arguments need to be converted. Some ideas:
         *  let n be the number of non-callback arguments
         *  a) partially apply the first n non-callback arguments, leaving 1
         *  b) convert the arguments to an object
         *     - e.g. function(a, b, callback) -> function(args, callback)
         *       where args is an object of {a: ..., b: ...}
         */
        var Async = (function() {

            /** async :: (a -> (b -> ()) -> a -> Async a b
             *  Creates an Async from an asynchronous function(a, callback)
             */
            var async = function(f) {
                var me = function(a) {
                    return Future.future(function(callback) {
                        f(a, callback);
                    });
                };

                /** map :: this Async a b -> (b -> c) -> Async a c
                 *  Not your average 'map' function. Maps a function over the output.
                 */
                me.map = function(mapper) {
                    return Async.async(function(a, callback) {
                        me(a)(function(b) {
                            var c = mapper(b);
                            callback(c);
                        });
                    });
                };

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
                var composeLtr = flip(composeRight);

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
                    return compose(me, other);
                };
                me.chain = me.composeL;
                me[">>>"] = me.composeL;

                me.kleisliL

            };

            return {
                async: async
            };
        });

        return {
            Async: Async,
            Future: Future
        };
    })();

})();
