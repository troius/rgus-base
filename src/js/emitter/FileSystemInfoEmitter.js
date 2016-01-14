"use strict";

var timers = require("timers"),
	os = require("os"),
	freediskspace = require("freediskspace"),
	Plugin = require("../Plugin.js");

const DEFAULT_CONFIG = {
	"interval": 15 * 1000
};

class FileSystemInfoEmitter extends Plugin {

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

		var me = this,
			hostname = os.hostname();

		this._timer = timers.setInterval(function() {

			freediskspace.driveList(function(err, drives) {
				drives.forEach(function(drive) {
					freediskspace.detail(drive, function(err, info) {
						me.process({
							"hostname": hostname,
							"drive": info.drive,
							"spaceTotal": info.total,
							"spaceUsed": info.used,
							"spaceFree": info.free,
							"percentUsed": Number(100 * info.used / (Math.max(info.total, 1))).toFixed(1),
							"percentFree": Number(100 * info.free / (Math.max(info.total, 1))).toFixed(1)
						});
					});
				});
			});
		}, this._config.interval);
	}

	stop() {
		super.stop();
		timers.clearInterval(this._timer);
		delete this._timer;
	}
}

module.exports = FileSystemInfoEmitter;
