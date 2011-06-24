require("../../include/include.js");

function testBindPassPass() {
    testFnsFromInt.forEach(function(f) {
        testInts.forEach(function(input) {
            var spy = jssert.spy();
            Bfuture.constant(input).bind(Bsync.sync(f))(spy, explode);
            var expected = f(input);
            spy.verifyArgs([[expected]]);
        });
    });
}

function testBindFail() {
    testFnsFromInt.forEach(function(f) {
        testInts.forEach(function(input) {
            var spy = jssert.spy();
            Bfuture.constantFail(input).bind(Bsync.sync(f))(explode, spy);
            spy.verifyArgs([[input]]);
        });
    });

}

function testBindPassFail() {
    // TODO
}