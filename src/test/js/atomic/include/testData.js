// TODO: this would make a good driver for creating an Async from a synchronous function
var sz = Async.async(function(a, callback) {
    callback(String(a));
});

var plus1 = Async.async(function(a, callback) {
    callback(a + 1);
});

var suffixQ = Async.async(function(a, callback) {
    callback(a + "q")
});

