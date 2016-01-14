"use strict";

const SystemInfoEmitter = require("../../src/js/emitter/SystemInfoEmitter.js"),
	FileSystemInfoEmitter = require("../../src/js/emitter/FileSystemInfoEmitter.js"),
	SshLoginEmitter = require("../../src/js/emitter/SshLoginEmitter.js"),
	TimeoutProcessor = require("../../src/js/processor/TimeoutProcessor.js"),
	ConsoleWriterConsumer = require("../../src/js/consumer/ConsoleWriterConsumer.js"),
	SendMailConsumer = require("../../src/js/consumer/SendMailConsumer.js"),
	TransformProcessor = require("../../src/js/processor/TransformProcessor.js"),
	NumberFilterProcessor = require("../../src/js/processor/NumberFilterProcessor.js"),
	RgusRemoteConsumer = require("../../src/js/consumer/RgusRemoteConsumer.js");

var sie = new SystemInfoEmitter({ interval: 3000 }),
	fse = new FileSystemInfoEmitter({ interval: 3000 }),
	ssh = new SshLoginEmitter(),
	down = new TimeoutProcessor({ timeout: 2500 }, sie),
	nfp = new NumberFilterProcessor({
		"leftHandProperty": "percentFree",
		"operator": "<",
		"rightHandValue": 100
	}, fse),
	tf1 = new TransformProcessor({
		"subject": "System Info",
		"body": "Uptime: $uptime"
	} /*, sie*/),
	tf2 = new TransformProcessor({
		"subject": "SSH Login",
		"body": "Username: $user"
	}, ssh),
	tf3 = new TransformProcessor({
		"subject": "Low disk space on $hostname $drive",
		"body": "Only $percentFree % of $spaceTotal bytes left"
	}, nfp),
	sm = new SendMailConsumer({
		"smtpHost": "smtp.gmail.com",
		"smtpPort": 465,
		"smtpUsername": "***",
		"smtpPassword": "***",
		"smtpSecure": true,
		"smtpIgnoreTLS": false,
		"from": "***",
		"to": "***",
	}, [tf1, tf2]),
	con = new ConsoleWriterConsumer(null, /*[sie, fse, ssh, down]*/ tf3),
	remote = new RgusRemoteConsumer({
		"hostname": "127.0.0.1",
		"port": 11170,
		"key": "SECRET"
	}, sie);

sie.start();
fse.start();
down.start();
ssh.start();
con.start();
tf1.start();
tf2.start();
sm.start();
remote.start();
