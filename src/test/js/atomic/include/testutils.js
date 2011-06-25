var withSpy = function(fn) {
    var spy = jssert.spy();
    fn(spy);
};

var explode = function() { throw "kaboom!"; };

var forEachWithSpy = function(data, f) {
    data.forEach(function(x) {
        var spy = jssert.spy();
        f(x, spy);
    });
}

var forEach2WithSpy = function(as, bs, f) {
    as.forEach(function(a) {
        bs.forEach(function(b) {
            var spy = jssert.spy();
            f(a, b, spy);
        })
    });
}

