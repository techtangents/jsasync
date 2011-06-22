var sz = Async.async(function(a, callback) {
    callback(String(a));
});

var plus1 = Async.async(function(a, callback) {
    callback(a + 1);
});

var suffixQ = Async.async(function(a, callback) {
    callback(a + "q")
});

var someValues = [null, undefined, [], {}, 0, -1, 1, 2, [1], "a", "", "b", function(){}];

var permute2 = function(input, f) {
    input.forEach(function(a) {
        input.forEach(function(b) {
            f(a, b);
        });
    });
};