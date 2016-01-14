"use strict";

const Plugin = require("../Plugin.js");

class TransformProcessor extends Plugin {

	constructor(config, sources) {
		super(config, sources);
		this._map = config;
	}

	processImpl(data) {

		var ret = {},
			prop,
			str;

		for(prop in this._map) {

			str = this._map[prop] || "";

			ret[prop] = str.replace(/\$[^\s]+/g, function(src) {
				src = src.substring(1);
				return data[src] || "?" + src;
			});
		}

		return ret;
	}

}

module.exports = TransformProcessor;
