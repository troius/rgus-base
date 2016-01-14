"use strict";

var Plugin = require("../Plugin.js"),
	Tail = require("always-tail");

const DEFAULT_CONFIG = {
	"logfile":	"/var/log/auth.log",
	"linebreak": "\n",
	"interval": 1000
};

const LINE_PATTERN = /([^\s]+) sshd\[[0-9]+\]: (Failed|Accepted) (password|publickey) for (invalid user )?(.+) from (.+) port ([0-9]+) ssh2/;

class SshLoginEmitter extends Plugin {

	constructor(config, sources) {

		super(config, sources);

		var key;

		config = config || {};

		for(key in DEFAULT_CONFIG) {
			if(!config.hasOwnProperty(key)) {
				config[key] = DEFAULT_CONFIG[key];
			}
		}

		this._config = config;
	}

	start() {

		super.start();

		var options = {
			"interval": this._config.interval,
			"blockSize": 4096
		};

		this._tail = new Tail(this._config.logfile, this._config.linebreak, options);

		var me = this;

		this._tail.on("line", function(line) {

			if(!line) {
				return;
			}

			var r = line.match(LINE_PATTERN);

			if(r === null) {
				return;
			}

			me.process({
				"hostname": r[1],
				"accepted": r[2] === "Accepted",
				"method": r[3],
				"validUser": r[4] === undefined,
				"user": r[5],
				"remoteHost": r[6],
				"remotePort": Number(r[7])
			});
		});

		this._tail.watch();
	}

	stop() {

		super.stop();

		this._tail.unwatch();
		delete this._tail;
	}
}

module.exports = SshLoginEmitter;
