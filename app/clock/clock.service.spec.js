'use strict'

describe('Clock', function() {

	var Clock;

	beforeEach(module('fibonacciClock'));

	beforeEach(inject(function(_Clock_) {
		Clock = _Clock_;
	}));

	it('should return an empty array for value 0 (zero)', function() {
		var result = Clock.get(0);
		expect(result.length).toBe(0);
	});

	it('should return a list of arrays, each one summing up to the input number', function() {
		function convert(x) {
			if (x === '1a' || x === '1b') {
				return 1;
			} else {
				return parseInt(x);
			}
		};
		function add(a, b) {
			return convert(a) + convert(b);
		};
		for (var i = 1; i <= 12; ++i) {
			var output = Clock.get(i);
			var result = output.reduce(add, 0);
			expect(result).toBe(i);
		};
	});

});