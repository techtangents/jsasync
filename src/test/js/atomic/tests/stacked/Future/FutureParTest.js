require("../../../include/include.js");

var testParOverConstant = forEachWithSpy_(testArrays, function(array, spy) {
    var futures = array.map(Future.constant);
    Future.par(futures)(spy);
    spy.verifyArgs([[array]]);
});