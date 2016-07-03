Module.register("MMM-Dublin-Bus", {

	// Default module config.
	defaults: {
		language: "en",
		stopNumber: 2188,
		initialLoadDelay: 0,
		updateInterval: 45000  // 45 Seconds
	},

	getScripts: function() {
		return ['moment.js']
	},

	// Define required scripts.
	getStyles: function() {
		return ["style.css"];
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "small light";
		//wrapper.innerHTML = this.interimResult;
		return wrapper;
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "DUBLIN_BUS_TIMES") {
			this.onDataRecieved(payload);
		} else if (notification === "DUBLIN_BUS_TIMES_UNAVAILABLE") {
			Log.error("Dublin bus times not available :(. Response code: " + payload);
		} else if (notification === "INCORRECT_URL") {
			Log.error("Issue with your url: " + payload);
		}
	},

	onDataRecieved: function(data) {
		Log.info("here " + data);
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		this.registerDublinbusWorker()
	},

	registerDublinbusWorker: function() {
		this.sendSocketNotification("START_DUBLINBUS", {
			config: this.config
		});
	}
});
