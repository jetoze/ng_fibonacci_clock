'use strict'

angular.module('fibonacciClock').
	factory('Clock', function() {
		// Maps a clock number (0-12) to all possible fibonacci combinations that add up 
		// to that number. For example, 4 = (1a + 2) or (1b + 2).
		var reprs = {
    	0: [],
    	1: [
    		['1a'],
    		['1b']
    	],
    	2: [
    		['1a', '1b'],
    		['2']
    	],
    	3: [
    		['1a', '2'],
    		['1b', '2'],
    		['3']
    	],
    	4: [
    		['1a', '3'],
    		['1b', '3']
    	],
    	5: [
    		['1a', '1b', '3'],
    		['2', '3'],
    		['5']
    	],
    	6: [
    		['1a', '5'],
    		['1b', '5'],
    		['1a', '2', '3'],
    		['1b', '2', '3']
    	],
    	7: [
    		['1a', '1b', '2', '3'],
    		['1a', '1b', '5'],
    		['2', '5']
    	],
    	8: [
    		['1a', '2', '5'],
    		['1b', '2', '5'],
    		['3', '5']
    	],
    	9: [
    		['1a', '1b', '2', '5'],
    		['1a', '3', '5'],
    		['1b', '3', '5']
    	],
    	10: [
    		['1a', '1b', '3', '5'],
    		['2', '3', '5']
    	],
    	11: [
    		['1a', '2', '3', '5'],
    		['1b', '2', '3', '5']
    	],
    	12: [
    		['1a', '1b', '2', '3', '5']
    	]
    };
    return {
        now: function() {
            return new Date();
        },
    	decompose: function(value) {
	    	var n = (typeof value === 'number') ? value : 0;
	    	var combinations = reprs[n];
	    	switch (combinations.length) {
	    		case 0: return [];
	    		case 1: return combinations[0];
	    		default:
	    			var index = Math.floor(Math.random() * combinations.length);
	    			return combinations[index];
	    	}
	    }
    };
	});