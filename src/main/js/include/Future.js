Ephox.core.module.define("techtangents.jsasync.Future", [], function(api) {

    var wrap = techtangents.jsasync.Util.wrap;

    /** Creates a Future, given a function that takes a callback as its only argument.
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
                    var b = mapper(a);
                    callback(b);
                });
            });
        };
        me["<$>"] = me.map;

        /** bind :: this Future a -> (a -> Future b) -> Future b
         *  Note: an Async is an (a -> Future b)
         */
        me.bind = function(aToFutureB) {
            return future(function(callback) {
                me(function(a) {
                    var futureB = aToFutureB(a);
                    futureB(callback);
                });
            });
        };
        me[">>="] = me.bind;

        /** bindAnon :: this Future a -> Future b -> Future b
         *  Note: (this Future a) is strict - it is evaluated and the result discarded.
         *  This allows side effects to be chained.
         */
        me.bindAnon = function(futureB) {
            return me.bind(function(_) {
                return futureB;
            });
        };
        me[">>"] = me.bindAnon;

        return me;
    };

    /** constant :: a -> Future a */
    var constant = function(x) {
        return future(function(callback) {
            callback(x);
        });
    };

    api.future = future;
    api.constant = constant;
});