(function(buster, define) {

var assert, fail, sentinel;

assert = buster.assert;
fail = buster.assertions.fail;

sentinel = { value: 'sentinel' };

define('when/monitor/aggregator-test', function (require) {

	var when, aggregator, monitor;

	when = require('when');
	aggregator = require('when/monitor/aggregator');
	monitor = typeof console != 'undefined' ? console : when;

	buster.testCase('when/monitor/aggregator', {
		'tearDown': function() {
			if(typeof monitor.PromiseStatus === 'function') {
				delete monitor.PromiseStatus;
			}
		},

		'should have PromiseStatus API': function() {
			assert.isFunction(aggregator(function(){}).PromiseStatus);
		},

		'promise': {
			'rejection should trigger report': function(done) {
				var captured;
				aggregator(function(promises) {
					captured = promises;
				}).publish(monitor);

				when.promise(function(_, reject) {
					reject(sentinel);
				}).then(fail, function(e) {
					setTimeout(function() {
						for(var key in captured) {
							assert.same(captured[key].reason, e);
						}
						done();
					}, 0)
				});
			}
		},

		'defer': {
			'rejection should trigger report': function(done) {
				var captured;
				aggregator(function(promises) {
					captured = promises;
				}).publish(monitor);

				when.defer().reject(sentinel).then(fail, function(e) {
					setTimeout(function() {
						for(var key in captured) {
							assert.same(captured[key].reason, e);
						}
						done();
					}, 0)
				});
			}
		}
	});

});
}(
		this.buster || require('buster'),
		typeof define === 'function' && define.amd ? define : function (id, factory) {
			var packageName = id.split(/[\/\-\.]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
			pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
			factory(function (moduleId) {
				return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
			});
		}
		// Boilerplate for AMD and Node
	));
