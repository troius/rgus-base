"use strict";

const nodemailer = require("nodemailer"),
	smtpTransport = require("nodemailer-smtp-transport"),
	Plugin = require("../Plugin.js");

class SendMailConsumer extends Plugin {

	constructor(config, sources) {
		super(config, sources);
		this._config = config || {};
	}

	start() {

		super.start();

		var config = this._config;

		this._transport = nodemailer.createTransport(smtpTransport({
			"host": config.smtpHost,
			"port": config.smtpPort,
			"auth": {
				"user": config.smtpUsername,
				"pass": config.smtpPassword
			},
			"secure": config.smtpSecure,
			"ignoreTLS": config.smtpIgnoreTLS
		}));
	}

	stop() {

		super.stop();

		delete this._transport;
		delete this._mailOptions;
	}

	process(data) {

		var mail = {
			"from": this._config.from,
			"to": this._config.to,
			"subject": data.subject || "<no subject specified>",
			"text": data.body || "<no body specified>"
		};

		console.log("sendmail: ", mail);

		this._transport.sendMail(mail, function(error, response) {
			if (error) {
				console.log(error);
			}
			else {
				console.log('Message sent');
			}
		});
	}
}

module.exports = SendMailConsumer;
