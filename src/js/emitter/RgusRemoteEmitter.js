"use strict";

const Plugin = require("../Plugin.js"),
	http = require("http");

class RgusRemoteEmitter extends Plugin {

	constructor(config, sources) {
		super(config, sources);
		this._config = config;
	}

	start() {

		super.start();

		var me = this;

		var server = http.createServer(function(req, res) {

			if(req.method !== "POST") {
				res.statusCode = 405;
				res.end("TRY HTTP POST");
				return;
			}

			var key = req.headers["x-rgus-key"] || "";

			if(key !== me._config.key) {
				res.statusCode = 403;
				res.end('ACCESS DENIED');
				return;
			}

			req.body = "";

			req.on("data", function(data) {
				this.body += data;
			});

			req.on("end", function () {

				var data;

				try {
					data = JSON.parse(this.body);
					me.process(data);
					res.end("OK");
				}
				catch(e) {
					res.statusCode = 500;
					res.end("INVALID CONTENT");
					return;
				}
			});
		});

		server.listen(this._config.port, this._config.hostname);
		this._server = server;
	}

	stop() {
		super.stop();
		this._server.close();
		delete this._server;
	}
}

module.exports = RgusRemoteEmitter;
