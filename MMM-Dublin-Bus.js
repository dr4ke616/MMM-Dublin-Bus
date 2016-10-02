Module.register("MMM-Dublin-Bus", {

	// Default module config.
	defaults: {
		language: "en",
		initialLoadDelay: 0,
		updateInterval: 10000,  // 10 Seconds
		useNotificationModule: false,
		mode: "dom" // or alert
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
		if (sender && this.config.useNotificationModule) {
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
		if (this.config.mode == "dom") {
			Log.info("Recieved data, updating dom");
			this.dublinBusPayload = data;
			this.updateDom();
		} else if (this.config.mode == "alert") {
			Log.info("Recieved data, sending alert");
			this.sendNotification("SHOW_ALERT", {
				//type: "notification",
				title: "Bus Times",
				message: data.join("</p><p>"),
				position: "center"
			});
		} else {
			throw "Exception: 'mode' settings in config must be either 'alert' or 'dom'";
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		if (this.config.mode == "alert") {
			// If its configured to use internal alerts, we dont want to update the DOM tree
			return wrapper;
		}

		var title = document.createElement("div");
		title.className = "bright";
		title.innerHTML = "Dublin Bus Times:";

		var container = document.createElement("div");
		container.className = "normal medium";

		if (this.dublinBusPayload === undefined)
			container.innerHTML = "Hmm... Bus times unavailable :(";
		else {
			container.innerHTML = this.dublinBusPayload.join("</p><p>");
		}

		wrapper.appendChild(title)
		wrapper.appendChild(container);

		return wrapper;
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		if (!this.config.useNotificationModule) {
			this.registerDublinbusWorker()
		}
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
