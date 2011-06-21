jsasync
=======

jsasync transforms async functions of the form: function(a, callback){ ... callback(b); } into Async
arrows and a Future monads.

As it is difficult to represent type classes in javascript, the arrow and monad functions are directly
augmented onto the Async and Future objects.


Async
-----

An Async represents an asynchronous computation. It is an augmented function and forms a category.
The typical use case is to convert an asynchronous function to an Async.
The asynchronous function is of two arguments: (a, callback) and this is converted to an Async, which is an
equivalent function in curried form: (a)(callback).

You invoke an Async with a value 'a' to get a Future, which is also an augmented function.
Invoke the Future with a callback, and the callback is invoked with the result.

Both the Async and the Future are functions augmented with category and monad capabilities respectively,
in order to facilitate composition.

As a function, an Async is:       a -> Future b
Expanding "Future b" gives us:    a -> (b -> ()) -> ()
Thus an Async is a curried function.
 - given x :: Async a, then x(a)(callback) will perform the async computation on 'a' and invoke 'callback' with the result.
 - x(a)(function(b) { ... });

Asyncs can be created from:
- single values (of type 'b' in the above type signatures. In this case, the argument 'a' is ignored)
- synchronous functions a -> b  i.e. function(a) { return b; }
- asynchronous functions (a, b -> ()) -> () i.e. function(a, callback) { ...; callback(b); };

Asynchronous functions with multiple non-callback arguments need to be converted. Some ideas:
let n be the number of non-callback arguments
a) partially apply the first n non-callback arguments, leaving 1
b) convert the arguments to an object
   - e.g. function(a, b, callback) -> function(args, callback)
     where args is an object of {a: ..., b: ...}


Future
------

A future represents the result of an asynchronous computation. It is a function(callback){...} and a monad.

- As a function it is (a -> ()) -> ()
                 i.e. function(callback) { ...; callback(a); }; -> Future a
- As an object it is a Monad

The function nature starts the computation, which terminates in the callback firing.
Ideally this should only be invoked at the edge of the system.

Future can be created from:
- single values
- synchronous thunks: -> b  i.e. function() { return b; }
- asynchronous functions b -> () -> () i.e. function(callback) { ...; callback(b); };

