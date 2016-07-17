Module.register("MMM-Dublin-Bus", {

	// Default module config.
	defaults: {
		language: "en",
		initialLoadDelay: 0,
		updateInterval: 10000  // 10 Seconds
	},

	getScripts: function() {
		return ['moment.js']
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "DUBLINBUS_TIMES_RECIEVED") {
			this.onDataRecieved(payload);
		} else if (notification === "DUBLINBUS_TIMES_UNAVAILABLE") {
			this.onDataRecieved(["Dublin bus times not available :("]);
		} else if (notification === "DUBLINBUS_TIMES_UNKNOWN_ERROR") {
			this.onDataRecieved(["Unknown error with Dublin Bus :("]);
		}
	},

	notificationReceived: function(notification, payload, sender) {
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
			if (notification === "DUBLINBUS_START") {
				this.registerDublinbusWorker();
			} else if (notification === "DUBLINBUS_STOP") {
				this.killDublinbusWorker();
				this.sendNotification("HIDE_ALERT");
			}
		}
	},

	onDataRecieved: function(data) {
		this.sendNotification("SHOW_ALERT", {
			//type: "notification",
			title: "Bus Times",
			message: data.join("</p><p>"),
			position: "center"
		});
	},

	start: function() {
		Log.info("Starting module: " + this.name);
	},

	killDublinbusWorker: function() {
		this.sendSocketNotification("DUBLINBUS_TIMES_KILL_WORKER");
	},

	registerDublinbusWorker: function() {
		this.sendSocketNotification("DUBLINBUS_TIMES_START_WORKER", {
			config: this.config
		});
	}
});
