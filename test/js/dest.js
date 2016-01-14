"use strict";

const ConsoleWriterConsumer = require("../../src/js/consumer/ConsoleWriterConsumer.js"),
	RgusRemoteEmitter = require("../../src/js/emitter/RgusRemoteEmitter.js");

var remote = new RgusRemoteEmitter({
		"hostname": "127.0.0.1",
		"port": 11170,
		"key": "SECRET"
	}),
	con = new ConsoleWriterConsumer(null, remote);

remote.start();
con.start();
