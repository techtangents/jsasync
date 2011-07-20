function goDoSomeSanityTests() {

    var Async = techtangents.jsasync.api.auto.Async;
    var Bsync = techtangents.jsasync.api.auto.Bsync;

    asyncTest("async sanity test", function() {
        var as = Async.async(function(a, callback) {
            setTimeout(function() {
                callback(a + 4);
            }, 50);
        });

        as(7)(function(b) {
            equal(b, 11);
            start();
        });
    });

    asyncTest("bsync pass sanity test", function() {
        var bs = Bsync.bsync(function(a, passCb, failCb) {
            setTimeout(function() {
                passCb(String(a));
            }, 17);
        });
        bs(7)(function(p) {
            setTimeout(function() {
                equal("7", p);
                start();
            }, 47);
        }, function(f) {
            setTimeout(function() {
                throw "tantrum";
            }, 64);
        });

    });
}
