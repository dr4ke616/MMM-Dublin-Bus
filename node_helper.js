
var NodeHelper = require("node_helper");
var validUrl = require("valid-url");
var https = require('https');
require('ssl-root-cas').inject();

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting module: " + this.name);

		this.bustimes = [];
		this.config = {}
		this.updateTimer = null;
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "DUBLINBUS_TIMES_START_WORKER") {
			this.config = payload.config
			this.scheduleUpdate(this.config.initialLoadDelay);
			console.log("Started dublinbus scheduler")
			return;
		} else if (notification === "DUBLINBUS_TIMES_KILL_WORKER") {
			clearTimeout(this.updateTimer);
			console.log("Stopped dublinbus scheduler")
			return;
		}
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.callDublinBus();
		}, nextLoad);
	},

	callDublinBus: function() {
		url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=' + this.config.stopNumber;
		var self = this;

		if (!validUrl.isUri(url)) {
			console.error("Invalid URL to Dublin bus: " + url);
			self.sendSocketNotification("DUBLINBUS_TIMES_UNKNOWN_ERROR");
			return;
		}

		https.get(url, (resp) => {
			if (resp.statusCode != 200) {
				console.error("Dublin bus times not available. Response code: " + payload);
				self.sendSocketNotification("DUBLINBUS_TIMES_UNAVAILABLE");
				return;
			}

			resp.on('data', (d) => {
				self.processData(JSON.parse(d));
			});

		}).on('error', (e) => {
			console.error(e);
			self.sendSocketNotification("DUBLINBUS_TIMES_UNKNOWN_ERROR");
		});
	},

	processData: function(data) {
		times = [];

		for (var i = 0; i < data.results.length; i++) {
			var route = data.results[i].route;
			var duetime = data.results[i].duetime;

			if (duetime == "Due") {
				times.push(route + " is due!");
			} else {
				var minsMsg = null;
				if (duetime == "1") {
					minsMsg = "min";
				} else {
					minsMsg = "mins";
				}
				times.push(route + " - " + duetime + " " + minsMsg);
			}
		};
		if (times.length == 0) {
			times.push("There are no bus times available");
		}
		this.bustimes = times;
		this.broadcastDublinbusTimes()
		this.scheduleUpdate()
	},

	broadcastDublinbusTimes: function() {
		this.sendSocketNotification("DUBLINBUS_TIMES_RECIEVED", this.bustimes);
	}

});
