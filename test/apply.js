// Test boilerplate
var buster, assert, refute, when;

buster = require('buster');
assert = buster.assert;
refute = buster.refute;

apply = require('../apply');
// end boilerplate

// variadic arguments-based callback
function f() {
	var sum, i = arguments.length;

	sum = 0;
	while(i) {
		sum += arguments[--i];
	}

	return sum;
}

buster.testCase('when/apply', {
	'should spread array onto arguments': function() {
		assert.equals(6, apply(f)([1,2,3]));
	},

	'should fail for non Array-like input': function() {
		assert.exception(function() {
			apply(f)(1,2,3);
		});
	}
});