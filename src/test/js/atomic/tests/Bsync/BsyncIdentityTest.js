require("../../include/include.js");

var testIdentity = forEachWithSpy_(testValues, function(x, spy) {
    Bsync.identity(x)(spy, explode);
    spy.verifyArgs([[x]]);
});

var testFaildentity = forEachWithSpy_(testValues, function(x, spy) {
    Bsync.faildentity(x)(explode, spy);
    spy.verifyArgs([[x]]);
});