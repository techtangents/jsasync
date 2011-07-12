require("../../include/include.js");

function test() {
    var Detective = techtangents.jsasync.util.Detective;
    jssert.assertEq("rhino", Detective.detect()); // these tests are only run in Rhino

    jssert.assertEq(true, techtangents.jsasync.api.rhino.stacked === auto);
}
