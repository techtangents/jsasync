Ephox.core.module.define("techtangents.async.Ticker", [], function(api) {
    api.create = function(num, done) {
        var count = 0;
        return function() {
            count++;
            if (count == len) {
                done();
            }
        };
    };
});