"use strict";

const Plugin = require("../Plugin.js");

class NumberFilterProcessor extends Plugin {

	constructor(config, sources) {
		super(config, sources);
		this._config = config || {};
	}

	processImpl(data) {

		var cfg = this._config,
			lh = cfg.leftHandProperty,
			rh = cfg.rightHandValue,
			op = cfg.operator;

		if(!data.hasOwnProperty(lh)) {
			// cannot compare, property missing
			return;
		}

		lh = Number(data[lh]);

		if(Number.isNaN(lh) || Number.isNaN(rh)) {
			// invalid Number(s)
			return;
		}

		var matches = 	(op === "==" && lh == rh) ||
						(op === "!=" && lh != rh) ||
						(op === "<" && lh < rh) ||
						(op === ">" && lh > rh) ||
						(op === "<=" && lh <= rh) ||
						(op === ">=" && lh >= rh);

		if(matches) {
			return data;
		}
	}
}

module.exports = NumberFilterProcessor;
