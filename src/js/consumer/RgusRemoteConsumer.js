"use strict";

const Plugin = require("../Plugin.js"),
	http = require("http");

class RgusRemoteConsumer extends Plugin {

	constructor(config, sources) {
		super(config, sources);
		this._config = config;
	}

	processImpl(data) {

		var body = JSON.stringify(data);

		var request = http.request({
			"hostname": this._config.hostname,
			"port": this._config.port,
			"method": "POST",
			"headers": {
				"x-rgus-key": this._config.key,
				"Content-Length": body.length
			}
		});

		/*
		request.on("error", function(error) {
			console.log(error);
		});
		*/

		request.write(body);
		request.end();
	}
}

module.exports = RgusRemoteConsumer;
