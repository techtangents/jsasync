require("../../../include/include.js");

var test = function() {
    // TODO: use a wider variety of test data
    var q = Bsync.sync(plus1);

    var r = Bsync.bsync(function(a, passCb, failCb) {
        passCb(function(x) {
            return a + "," + x;
        });
    });

    checkBfPass(q["<*>"](r)(3), "3,4");
};
