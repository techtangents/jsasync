Ephox.core.module.define("techtangents.jsasync.util.Ticker", [], function(api) {
    api.create = function(synchronizer, num, done) {
        var lock = {};

        var count = 0;
        function check() {
            if (count == num) {
                done();
            }
        }
        check();
        return synchronizer(lock, function() {
            count++;
            check();
        });
    };
});