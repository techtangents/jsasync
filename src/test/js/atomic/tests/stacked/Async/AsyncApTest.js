require("../../../include/include.js");

var test = function() {
    // TODO: use a wider variety of test data
    var q = Async.sync(plus1);

    var r = Async.async(function(a, cb) {
        cb(function(x) {
            return a + "," + x;
        });
    });

    checkF(q["<*>"](r)(3), "3,4");
};