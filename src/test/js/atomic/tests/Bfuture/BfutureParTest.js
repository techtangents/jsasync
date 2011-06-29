require("../../include/include.js");

function test() {
    var spy = jssert.spy();
    Bfuture.par([])(spy, explode);
    spy.verifyArgs([[[]]]);
}