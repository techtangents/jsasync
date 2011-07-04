require("../../include/include.js");

function testSetTimeout() {
    var done = false;

    doSetTimeout(function() {
        done = true;
    }, 100);

    waitFor(function() {
        return done;
    });
}

function testDelayed() {
    var done = false;

    var q = delayed(function(x) {
        done = true;
        return x + 2;
    });

    var spy = jssert.spy();
    var f = Async.sync(q)(2)(spy);

    waitFor(function() {
        return done;
    });
    spy.verifyArgs([[4]]);
}