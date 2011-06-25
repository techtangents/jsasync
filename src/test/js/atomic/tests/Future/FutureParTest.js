require("../../include/include.js");

var testParOverConstant = function() {
    testArrays.forEach(function(array) {
        withSpy(function(spy) {
            var futures = array.map(Future.constant);
            Future.par(futures)(spy);
            spy.verifyArgs([[array]]);
        });
    });
};