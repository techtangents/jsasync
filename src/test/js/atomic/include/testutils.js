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

var forEachWithSpy = function(data, f) {
    data.forEach(function(x) {
        var spy = jssert.spy();
        f(x, spy);
    });
}

var forEachWithSpy_ = de(forEachWithSpy);

var forEach2WithSpy = function(as, bs, f) {
    as.forEach(function(a) {
        bs.forEach(function(b) {
            var spy = jssert.spy();
            f(a, b, spy);
        })
    });
}

var forEach2WithSpy_ = de(forEach2WithSpy);

var permute2 = function(input, f) {
    input.forEach(function(a) {
        input.forEach(function(b) {
            f(a, b);
        });
    });
};

var permute2_ = de(permute2);