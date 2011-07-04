require("../../include/include.js");

function testSetTimeout() {
    var done = false;

    setTimeout(function() {
        done = true;
    }, 100);

    waitFor(function() {
        return done;
    });
}
