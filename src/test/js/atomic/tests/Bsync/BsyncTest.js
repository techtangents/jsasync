require("../../include/include.js");

function testIdentity() {
    testValues.forEach(function(x) {
        var spy = jssert.spy();
        Bsync.identity(x)(spy, explode);
        spy.verifyArgs([[x]]);
    });
}

function testFaildentity() {
    testValues.forEach(function(x) {
        var spy = jssert.spy();
        Bsync.faildentity(x)(explode, spy);
        spy.verifyArgs([[x]]);
    });
}
