"use strict";

class Plugin {

	constructor(config, sources) {

		this._running = false;
		this._listeners = new Set();

		var me = this;

		if(sources instanceof Plugin) {
			sources._listeners.add(me);
		}
		else if(sources instanceof Array) {
			sources.forEach(function(source) {
				source._listeners.add(me);
			});
		}
		else if(sources !== null && sources !== undefined) {
			throw new Error("invalid source(s)");
		}
	}

	start() {

		if(this._running) {
			throw new Error(this.constructor.name + " already running");
		}

		this._running = true;
	}

	stop() {

		if(!this._running) {
			throw new Error(this.constructor.name + " not running");
		}

		this._running = false;
	}

	/*final*/ process(data) {

		data = this.processImpl(data);

		if(data !== undefined) {
			this._listeners.forEach(function(listener) {
				listener.process(data);
			});
		}
	}

	processImpl(data) {
		return data;
	}
}

module.exports = Plugin;
