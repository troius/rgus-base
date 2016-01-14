"use strict";

var timers = require("timers"),
	os = require("os"),
	Plugin = require("../Plugin.js");

const DEFAULT_CONFIG = {
	"interval": 15 * 1000
};

class SystemInfoEmitter extends Plugin {

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
	}

	start() {

		super.start();

		var me = this;

		this._timer = timers.setInterval(function() {

			var la = os.loadavg();

			me.process({
				"hostname": os.hostname(),
				"totalmem": os.totalmem(),
				"freemem": os.freemem(),
				"loadavg1": la[0],
				"loadavg5": la[1],
				"loadavg15": la[2],
				"uptime": os.uptime()
			});

		}, this._config.interval);
	}

	stop() {
		super.stop();
		timers.clearInterval(this._timer);
		delete this._timer;
	}
}

module.exports = SystemInfoEmitter;
