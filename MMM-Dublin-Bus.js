Module.register("MMM-Dublin-Bus", {

	// Default module config.
	defaults: {
		language: "en",
		stopNumber: 2188,
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
			Log.error("Dublin bus times not available :(. Response code: " + payload);
		} else if (notification === "DUBLINBUS_TIMES_FAILURE_INVALID_URL") {
			Log.error("Issue with your url: " + payload);
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

		this.registerDublinbusWorker()
	},

	registerDublinbusWorker: function() {
		this.sendSocketNotification("DUBLINBUS_START", {
			config: this.config
		});
	}
});
