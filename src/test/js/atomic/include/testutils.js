var withSpy = function(fn, expectedArgs) {
    var spy = jssert.spy();
    fn()(spy);
    spy.verifyArgs(expectedArgs);
};

var testWithSpy = function(fn, expectedArgs) {
    return function() {
        withSpy(fn, expectedArgs);
    };
};

var explode = function() { throw "kaboom!"; };