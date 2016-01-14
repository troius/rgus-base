"use strict";

const Plugin = require("../Plugin.js");

class ConsoleWriterConsumer extends Plugin {

	process(data) {
		console.log(data);
	}
}

module.exports = ConsoleWriterConsumer;
