require("../../include/include.js");

function testSetTimeout() {
    var done = false;

    doSetTimeout(function() {
        done = true;
    }, 100);

    var elapsed = 0;
    var delta = 50;
    while(!done || elapsed < 6000) {
        java.lang.Thread.sleep(delta);
        elapsed += delta;
    }
    jssert.assertEq(true, done);
}

function testDelayed() {
    var q = delayed(function(x) {
        return x + 2;
    });

    var spy = jssert.spy();
    var f = Async.sync(q)(2)(spy);

    q.join();
    spy.verifyArgs([[4]]);
}