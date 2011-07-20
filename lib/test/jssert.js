/*
jssert library - assertion library for javascript

Requires JSON.stringify to be available (e.g. from json2.js)
*/

var jssert = {};
jssert.global = (function() { return this; })();

(function() {

    jssert.trueType = function(x) {
        var t = typeof x;
		if (t === "object" && Array.prototype.isPrototypeOf(x)) return "array";
        if (x === null) return "null";
		return t;
    };

    function pass() {
        return {eq: true};
    }

    function fail(why) {
        return {eq: false, why: why};
    }

    function failCompare(x, y, prefix) {
        var prefix_ = prefix || "Values were different";
        return fail(prefix_ + ": [" + String(x) + "] vs [" + String(y) + "]")
    }

    function isOneOf(x, array) {
        for (var i = 0; i < array.length; i++) if (x === array[i]) return true;
        return false;
    }

    function isEquatableType(x) {
        return isOneOf(x, ["undefined", "boolean", "number", "string", "function", "xml", "null"]);
    }

    function compareArrays(x, y) {
        if (x.length != y.length) return failCompare(x.length, y.length, "Array lengths were different");

        for (var i = 0; i < x.length; i++) {
            var result = doCompare(x[i], y[i]);
            if (!result.eq) return fail("Array elements " + i + " were different: " + result.why);
        }
        return pass();
    }

    function sortArray(x) {
        var y = x.slice();
        y.sort();
        return y;
    }

    // array.keys is javascript 1.8.5 and later, so we can't use it here
    function keys(o) {
        var r = [];
        for(var i in o) if (o.hasOwnProperty(i)) {
            r.push(i);
        }
        return r;
    }

    function sortedKeys(o) {
        return sortArray(keys(o));
    }

    function compareObjects(x, y) {
        var constructorX = x.constructor;
        var constructorY = y.constructor;
        if (constructorX !== constructorY) return failCompare(constructorX, constructorY, "Constructors were different");

        var keysX = sortedKeys(x);
        var keysY = sortedKeys(y);

        var keysResult = compareArrays(keysX, keysY);
        if (!keysResult.eq) return failCompare(JSON.stringify(keysX), JSON.stringify(keysY), "Object keys were different");

        for (var i in x) if (x.hasOwnProperty(i)) {
            var xValue = x[i];
            var yValue = y[i];
            var valueResult = doCompare(xValue, yValue);
            if (!valueResult.eq) return fail("Objects were different for key: [" + i + "]: " + valueResult.why);
        }
        return pass();
    }

    function doCompare(x, y) {
        var typeX = jssert.trueType(x);
        var typeY = jssert.trueType(y);

        if (typeX !== typeY) return failCompare(typeX, typeY, "Types were different");

        if (isEquatableType(typeX)) {
            if (x !== y) return failCompare(x, y);

        } else if (x == null) {
            if (y !== null) return failCompare(x, y);

        } else if (typeX === "array") {
            var arrayResult = compareArrays(x, y);
            if (!arrayResult.eq) return arrayResult;

        } else if (typeX === "object") {
            var objectResult = compareObjects(x, y);
            if (!objectResult.eq) return objectResult;
        }
        return pass();
    }

    /**
     * Compares two javascript values for equivalency, returning an object describing the result.
     * @return object: {eq: boolean, why: "message if failed"};
     * @param x
     * @param y
     */
    jssert.compare = function(x, y) {
        var result = doCompare(x, y);
        var bar = "-----------------------------------------------------------------------";
        return {
            eq: result.eq,
            why: result.why + "\n" + bar + "\n" + JSON.stringify(x) + "\n" + bar + "\n" + JSON.stringify(y) + "\n" + bar + "\n"
        }
    };

    /**
     * Compares two javascript values for equivalency, returning boolean.
     * @return boolean: x is equivalent to y
     * @param x
     * @param y
     */
    jssert.eq = function(x, y) {
        var result = jssert.compare(x, y);
        return result.eq;
    };

    /**
     * Compares two javascript values for equivalency, throwing if they are not equivalent.
     * @return undefined
     * @throws string: if x and y are not equivalent, an error string is thrown describing the result.
     * @param x
     * @param y
     */
    jssert.assertEq = function(x, y) {
        var result = jssert.compare(x, y);
        if (!result.eq) throw result.why;
        return undefined;
    };

    jssert.assertSame = function(x, y) {
        if (x !== y) throw failCompare(x, y).why;
    };

    jssert.assertThrows = function(f, expectedException) {
        var token = {};

        try {
            f();
            throw token;
        } catch(e) {
            if (e === token) throw "Expected exception, but none was thrown";
            if (expectedException !== undefined) {
                jssert.assertEq(expectedException, e);
            }
        }
    };

})();

jssert.spy = function() {

    var invocations = [];
    var invocationArgs = [];

    var clone = function(x) {
        return Array.prototype.slice.call(x);
    };

    var f = function() {
        var args = clone(arguments);

        invocations.push({
            thisArg: this,
            args: args
        });
        invocationArgs.push(args);
    };

    f.getInvocations = function() {
        return clone(invocations);
    };

    f.getInvocationArgs = function() {
        return clone(invocationArgs);
    };

    f.verify = function(expected) {
        jssert.assertEq(expected.length, invocations.length);
        for (var i = 0; i < invocations.length; i++) {
            var ai = invocations[i];
            var ei = expected[i];
            jssert.assertSame(ei.thisArg, ai.thisArg);
            jssert.assertEq(ei.args, ai.args);
        }
    };

    f.verifyArgs = function(expected) {
        jssert.assertEq(expected, invocationArgs);
    };
    return f;
};
