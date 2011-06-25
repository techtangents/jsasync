var sz = Async.async(function(a, callback) {
    callback(String(a));
});

var plus1 = Async.async(function(a, callback) {
    callback(a + 1);
});

var suffixQ = Async.async(function(a, callback) {
    callback(a + "q")
});

var arrayUnital = function(x) { return [x]; }

var testValues = [null, undefined, [], {}, 0, -1, 1, 2, [1], "a", "", "b", function(){}];
var testArrays = testValues.map(arrayUnital).concat([
    [], [[]], [[[]]], [[[[]]]], [1, [2], [[3]]], [1, 2, 3, 4], testValues, ['a', 'b', 'c', 'd']
]);
var testInts = [-1000, -50, -49, -100, -10, -3, -2, -1, 0, 1, 2, 3, 4, 10, 11, 99, 100, 1000, 10000, 1012413];

var testFunctionsFromInt = [
    function(a) { return a + 2; },
    function(a) { return String(a); },
    function(a) { return a; },
    function(a) { return undefined; },
    function(a) { return null; },
    function(a) { return [a, a]; }
];

var testFunctions = [
    function(x) { return x; },
    function(x) { return 2; },
    function(x) { return [x]; },
    function(x) { return {a: x, b: [x]}; }
];

var permute2 = function(input, f) {
    input.forEach(function(a) {
        input.forEach(function(b) {
            f(a, b);
        });
    });
};
