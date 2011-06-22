require("../../include/include.js");

var testParOverConstant = function() {
    testArrays.forEach(function(array) {
        withSpy(function() {
            var futures = array.map(Future.constant);
            return Future.par(futures);
        }, [[array]]);
    });
};