'use strict'

var HOUR_COLOR = '#FF0000';
var MINUTE_COLOR = '#00FF00';
var HOUR_AND_MINUTE_COLOR = '#0000FF';
var NO_COLOR = '#FFFFFF';

function getColor(timeToRender, rect) {
	var hourSet = timeToRender.hourParts.includes(rect);
	var minuteSet = timeToRender.minuteParts.includes(rect);
	if (hourSet && minuteSet) {
		return HOUR_AND_MINUTE_COLOR;
	} else if (hourSet) {
		return HOUR_COLOR;
	} else if (minuteSet) {
		return MINUTE_COLOR;
	} else {
		return NO_COLOR;
	}
};

angular.module('fibonacciClock').
	component('clock', {
		templateUrl: 'clock/clock.template.html',
		bindings: {
			boxSize: '<',
			borderSize: '<',
			digitalFontSize: '<'
		},
		controller: ['Clock', '$interval', function(Clock, $interval) {
			this.boxSize = 50;
			this.borderSize = 4;
			this.digitalFontSize = 16;
			this.hours = -1;
			this.minutes = -1;
			this.ampm = 'AM';
			// Keeps track of the last time that was rendered. We use this to switch the display
			// only when the time actually changes. Otherwise the clock would constantly change
			// appearance with the same frequency as our animation, since we pick a random 
			// combination each time.
			this.lastRenderedTime = null;

			this.getTimeToRender = function() {
				var now = Clock.now();
				console.log(now);
				var timeToRender = Clock.timeToRender(now);
				this.hours = timeToRender.hours;
				this.minutes = timeToRender.minutes;
				this.ampm = timeToRender.isAm() ? 'AM' : 'PM';
				if (this.isNewTime(timeToRender)) {
					this.lastRenderedTime = timeToRender;
					console.log('Hours: ' + timeToRender.hours + ' -> ' + timeToRender.hourParts);
					console.log('Minutes: ' + now.getMinutes() + ' -> ' + timeToRender.minuteParts);
					return timeToRender;
				} else {
					console.log('No change to render');
					return null;
				}
			};

			this.isNewTime = function(timeToRender) {
				return !this.lastRenderedTime || !timeToRender.isSameTime(this.lastRenderedTime);
			};

			this.updateDisplay = function(timeToRender) {
				if (!timeToRender) {
					return;
				}
				this.oneA_Bg = getColor(timeToRender, "1a");
				this.oneB_Bg = getColor(timeToRender, "1b");
				this.two_Bg = getColor(timeToRender, "2");
				this.three_Bg = getColor(timeToRender, "3");
				this.five_Bg = getColor(timeToRender, "5");
			};

			this.update = function() {
				var timeToRender = this.getTimeToRender();
				this.updateDisplay(timeToRender);
				this.boxSize += 10;
			};

			this.minuteDisplay = function() {
				return this.minutes < 10 ? '0' + this.minutes : '' + this.minutes;
			};

			this.update();

			/* FIXME: The following doesn't work. I get an error like this in the console:
						"TypeError: Cannot read property 'getTimeToRender' of undefined"
			var fn = this.update;
			$interval(fn, 1000);
			*/
			// HACK: Do it like this for now. Not pretty, obviously, since we're duplicating code.
			var self = this;
			$interval(function() {
				var timeToRender = self.getTimeToRender();
				self.updateDisplay(timeToRender);
			}, 1000);
		}]
	});
