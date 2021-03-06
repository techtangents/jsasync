var de = function(f) {
    return function() {
        var args = arguments;
        var thisArg = this;
        return function() {
            f.apply(thisArg, args);
        };
    };
};

var withSpy = function(fn) {
    var spy = jssert.spy();
    fn(spy);
};

var withSpy_ = de(withSpy);

var explode = function() { throw "kaboom!"; };

var forEach = function(as, f) {
    as.forEach(f);
};

var forEach_ = de(forEach);

var forEach2 = function(as, bs, f) {
    as.forEach(function(a) {
        bs.forEach(function(b) {
            f(a, b);
        });
    });
};

var forEach2_ = de(forEach2);

var forEachWithSpy = function(data, f) {
    data.forEach(function(x) {
        var spy = jssert.spy();
        f(x, spy);
    });
};

var forEachWithSpy_ = de(forEachWithSpy);

var forEach2WithSpy = function(as, bs, f) {
    forEach2(as, bs, function(a, b) {
        var spy = jssert.spy();
        f(a, b, spy);
    });
};

var forEach3 = function(as, bs, cs, f) {
    forEach2(as, bs, function(a, b) {
        cs.forEach(function(c) {
            f(a, b, c);
        });
    });
};

var forEach3_ = de(forEach3);

var forEach2WithSpy_ = de(forEach2WithSpy);

var assertEitherEquals = function(a, b) {
    jssert.assertEq(a.isGood(), b.isGood());
    if (a.isGood()) {
        jssert.assertEq(a.goodOrDie(), b.goodOrDie());
    } else {
        jssert.assertEq(a.badOrDie(), b.badOrDie());
    }
};

var permute2 = function(as, f) {
    forEach2(as, as, f);
};

var permute2_ = de(permute2);

var forEaches = function(as, bs, f) {
    for (var i = 0; i < Math.min(as.length, bs.length); i++) {
        f(as[i], bs[i]);
    }
};

var assertArrayOfEitherEquals = function(as, bs) {
    jssert.assertEq(as.length, bs.length);
    forEaches(as, bs, assertEitherEquals);
};

var sift = function(inputs, pred) {
    return inputs.map(function(a) {
        return Either[pred(a) ? "good" : "bad"](a);
    });
};

importClass(java.lang.Thread);
importClass(java.lang.Runnable);

var waitFor = function(condition) {
    var quandition = sync(condition);

    var elapsed = 0;
    var timedOut = function() {
        // With Ent's multi-threaded js test runner, and multi-threaded amap tests, we need a large timeout.
        // timeout should only occur with bugs
        return elapsed > 120000;
    };

    var delta = 1;
    while(!quandition() && !timedOut()) {
        Thread.sleep(delta);
        elapsed += delta;
        delta *= 1.5; // back-off, so we don't get in the way of the actual work
    }

    if (!quandition()) {
        fail("condition not met before timeout");
    }
};

var randomSleep = function() {
    Thread.sleep(Math.random() * 8);
};

var setTimeout = function(f, delay) {
    var thread = new Thread(new Runnable({
        run: function() {
            randomSleep();
            f();
        }
    }));
    thread.setDaemon(true);
    thread.start();
};

var forChainers = function(f) {
    f(">>>", "<<<");
    f("chain", "compose");
};

var forChainers2 = function(as, bs, f) {
    return forEach2(as, bs, function(a, b) {
        forChainers(function(chainName, composeName) {
            f(a, b, chainName, composeName);
        });
    });
};

var forChainers2_ = de(forChainers2);

var forChainers3 = function(as, bs, cs, f) {
    return forEach3(as, bs, cs, function(a, b, c) {
        forChainers(function(chainName, composeName) {
            f(a, b, c, chainName, composeName);
        });
    });
};

var forChainers3_ = de(forChainers3);

var repeat = function(a, count) {
    var r = [];
    for (var i = 0; i < count; i++) {
        r.push(a);
    }
    return r;
};

var waitForSpy = function(spy) {
    waitFor(function() {
        return spy.getInvocationArgs().length >= 1;
    });
};

var waitForSpies = function(spies) {
    spies.forEach(waitForSpy);
};

function waitForSpyOrBomb(spy, bomb) {
    waitFor(function() {
        return spy.getInvocationArgs().length === 1 || bomb.hasBeenCalled();
    });
};

function makeBomb() {
    var called = false;
    var f = function() {
        called = true;
        explode();
    };

    f.hasBeenCalled = function() {
        return called;
    };

    f.maybeExplode = function() {
        if (called) explode();
    };

    return f;
};

var checkBfFail = function(bfuture, expected) {
    var spy = jssert.spy();
    var bomb = makeBomb();
    bfuture(bomb, spy);
    waitForSpyOrBomb(spy, bomb);
    bomb.maybeExplode();
    spy.verifyArgs([[expected]]);
};

var checkBfPass = function(bfuture, expected) {
    var spy = jssert.spy();
    var bomb = makeBomb();
    bfuture(spy, bomb);
    waitForSpyOrBomb(spy, bomb);
    bomb.maybeExplode();
    spy.verifyArgs([[expected]]);
};

var syncSpy = function() {
    var jspy = jssert.spy();
    var q = sync(function() {
        return jspy.apply(this, arguments);
    });

    var f = function() {
        return q.apply(this, arguments);
    };

    f.getInvocationArgs = sync(function() {
        return jspy.getInvocationArgs.apply(this, arguments);
    });
    f.verifyArgs = sync(function() {
        return jspy.verifyArgs.apply(this, arguments);
    });

    return f;
};

var checkF = function(future, expected) {
    var spy = syncSpy();
    future(spy);
    waitForSpy(spy);
    spy.verifyArgs([[expected]]);
};

var unitTest = function(f) {
    return function() {
        f(stacked.Future, stacked.Async, stacked.Bfuture, stacked.Bsync);
        f(bounced.Future, bounced.Async, bounced.Bfuture, bounced.Bsync);
        f(auto.Future,    auto.Async,    auto.Bfuture,    auto.Bsync);
    };
};
