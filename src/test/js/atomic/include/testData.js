var sz      = function(a) { return String(a); };
var plus1   = function(a) { return a + 1;     };
var plus2   = function(a) { return a + 2;     };
var gte2    = function(a) { return a >= 2;    };
var suffixQ = function(a) { return a + "q";   };
var toNum   = function(a) { return Number(a); };

var arrayUnital = function(x) { return [x]; }

var testValues = [null, undefined, [], {}, 0, -1, 1, 2, [1], "a", "", "b", function(){}];

var testNonEmptyArrays = testValues.map(arrayUnital).concat([
    [[]], [[[]]], [[[[]]]], [1, [2], [[3]]], [1, 2, 3, 4], testValues, ['a', 'b', 'c', 'd']
]);
var testArrays = testNonEmptyArrays.concat([[]]);
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