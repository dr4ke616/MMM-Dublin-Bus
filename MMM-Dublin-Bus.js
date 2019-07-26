Module.register("MMM-Dublin-Bus", {

    internalNotifications: {
        RECEIVED: "DUBLIN_BUS_TIMES_RECEIVED",
        UNAVAILABLE: "DUBLIN_BUS_TIMES_UNAVAILABLE",
        UNKNOWN_ERROR: "DUBLIN_BUS_TIMES_UNKNOWN_ERROR",
        START_WORKER: "DUBLIN_BUS_TIMES_START_WORKER",
        STOP_WORKER: "DUBLIN_BUS_TIMES_STOP_WORKER",
    },

    notifications: {
        START: "DUBLIN_BUS_START",
        STOP: "DUBLIN_BUS_STOP",
    },

    // Default module config.
    defaults: {
        language: "en",
        initialLoadDelay: 0,
        updateInterval: 10000,  // 10 Seconds
        mode: "dom" // or alert
    },

    getScripts: function () {
        return ['moment.js']
    },

    // Override socket notification handler.
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case this.internalNotifications.RECEIVED:
                this.onDataRecieved(payload);
                break;
            case this.internalNotifications.UNAVAILABLE:
                this.onDataRecieved(["Dublin bus times not available :("]);
                break;
            case this.internalNotifications.UNKNOWN_ERROR:
                this.onDataRecieved(["Unknown error with Dublin Bus :("]);
                break;
        }
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED" && this.config.mode === "dom") {
            this.registerDublinbusWorker();
        }
        if (sender) {
            Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
            switch (notification) {
                case this.notifications.START:
                    this.registerDublinbusWorker();
                    break;
                case this.notifications.STOP:
                    this.killDublinbusWorker();
                    this.sendNotification("HIDE_ALERT");
                    break;
            }
        }
    },

    suspend: function () {
        this.killDublinbusWorker();
    },

    resume: function () {
        this.registerDublinbusWorker();
    },

    onDataRecieved: function (data) {
        if (this.config.mode === "dom") {
            Log.info("MMM-Dublin-Bus recieved data, updating dom");
            this.dublinBusPayload = data;
            this.updateDom();
        } else if (this.config.mode === "alert") {
            Log.info("MMM-Dublin-Bus recieved data, sending alert");
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
    getDom: function () {
        let wrapper = document.createElement("div");
        if (this.config.mode === "alert") {
            // If its configured to use internal alerts, we dont want to update the DOM tree
            return wrapper;
        }

        let title = document.createElement("div");
        title.className = "bright";
        title.innerHTML = "Dublin Bus Times:";

        let container = document.createElement("div");
        container.className = "normal medium";

        if (this.dublinBusPayload === undefined)
            container.innerHTML = "Hmm... Bus times unavailable :(";
        else {
            container.innerHTML = this.dublinBusPayload.join("</p><p>");
        }

        wrapper.appendChild(title);
        wrapper.appendChild(container);

        return wrapper;
    },

    start: function () {
        Log.log("Starting module: " + this.name);
    },

    killDublinbusWorker: function () {
        this.sendSocketNotification(this.internalNotifications.STOP_WORKER);
    },

    registerDublinbusWorker: function () {
        this.sendSocketNotification(this.internalNotifications.START_WORKER, {
            config: this.config
        });
    }
});
