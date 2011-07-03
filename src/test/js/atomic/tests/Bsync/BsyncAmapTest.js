require("../../include/include.js");

var testPass = forEach2WithSpy_(testFunctions, testArrays, function(f, inputs, spy) {
    var expected = inputs.map(f);
    var bs = Bsync.sync(f);
    bs.amap(inputs)(spy, explode);
    spy.verifyArgs([[expected]]);
});