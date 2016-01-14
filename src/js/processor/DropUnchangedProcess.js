"use strict";

const Plugin = require("../Plugin.js");

class DropUnchangedProcessor extends Plugin {

	processImpl(data) {

		var dataJson;

		try {
			dataJson = JSON.stringify(data);
		}
		catch(e) {
		}

		if(dataJson !== this._lastDataJson) {
			this._lastDataJson = dataJson;
			return data;
		}
	}
}

module.exports = DropUnchangedProcessor;
