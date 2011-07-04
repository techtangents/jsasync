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
    for (var i = 0; i < Math.min(as.length, bs.lenth); i++) {
        f(a, b);
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
    var elapsed = 0;
    var delta = 10;
    while(!condition() || elapsed < 6000) {
        Thread.sleep(delta);
        elapsed += delta;
    }
    jssert.assertEq(true, condition());
};

var randomSleep = function() {
    Thread.sleep(Math.random() * 15);
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
