// FIX: dupe

jssert.assertEq(undefined, this.stacked);
var stacked = techtangents.jsasync.api.rhino.stacked;

jssert.assertEq(undefined, this.bounced);
var bounced = techtangents.jsasync.api.rhino.bounced;

jssert.assertEq(undefined, this.Async);
var Async = stacked.Async;

jssert.assertEq(undefined, this.Future);
var Future = stacked.Future;

jssert.assertEq(undefined, this.Bsync);
var Bsync = stacked.Bsync;

jssert.assertEq(undefined, this.Bfuture);
var Bfuture = stacked.Bfuture;

jssert.assertEq(undefined, this.Either);
var Either = techtangents.jsasync.util.Either;

jssert.assertEq(undefined, this.Util);
var Util = techtangents.jsasync.util.Util;
