require("../../include/include.js");


var testMap = function() {
    var input = 3;
    var mapper = function(x) { return x + 1; };

    var spy = jssert.spy();

    Bfuture.constant(input).map(mapper)(spy, explode);
    spy.verifyArgs([[mapper(input)]]);
};