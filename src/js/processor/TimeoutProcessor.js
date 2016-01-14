"use strict";

const Plugin = require("../Plugin.js"),
	timers = require("timers");

const DEFAULT_CONFIG = {
	"source": null,
	"timeout": 15 * 1000
};

function now() {
	return new Date().getTime();
}

class TimeoutProcessor extends Plugin {

	constructor(config, sources) {

		super(config, sources);

		config = config || {};

		var key;

		for(key in DEFAULT_CONFIG) {
			if(!config.hasOwnProperty(key)) {
				config[key] = DEFAULT_CONFIG[key];
			}
		}

		this._config = config;
		this._passthru = false;
	}

	start() {

		super.start();

		this._errors = 0;
		this._lastDataTS = now();
		this._timer = timers.setTimeout(this.timeoutImpl.bind(this), this._config.timeout);
	}

	stop() {

		super.stop();

		timers.clearTimeout(this._timer);

		delete this._timer;
		delete this._lastDataTS;
		delete this._errors;
	}

	processImpl(data) {

		if(this._passthru === true) {
			// passthru own data
			return data;
		}

		// consume source data and return/emit nothing

		this._lastDataTS = now();
		this._errors = 0;

		timers.clearTimeout(this._timer);

		this._timer = timers.setTimeout(this.timeoutImpl.bind(this), this._config.timeout);
	}

	timeoutImpl() {

		var n = now(),
			d = n - this._lastDataTS,
			msg;

		if(d < 1000) {
			msg = d + "ms";
		}
		else if(d < 60000) {
			msg = Math.floor(d / 1000) + "s";
		}
		else {
			msg = Math.floor(d / 60000) + "m";
		}

		this._errors++;
		var retryIn = this._config.timeout << Math.min(this._errors, 10);

		this._passthru = true;

		this.process({
			"message": "source down for " + msg,
			"errors": this._errors,
			"retryIn": retryIn
		});

		this._passthru = false;

		this._timer = timers.setTimeout(this.timeoutImpl.bind(this), retryIn);
	}
}

module.exports = TimeoutProcessor;
