let NodeHelper = require("node_helper");
let validUrl = require("valid-url");
let https = require('https');

require('ssl-root-cas').inject();

module.exports = NodeHelper.create({

    start: function () {
        console.log("Starting module: " + this.name);

        this.bustimes = [];
        this.config = {};
        this.updateTimer = null;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "DUBLIN_BUS_TIMES_START_WORKER") {
            this.config = payload.config;
            this.scheduleUpdate(this.config.initialLoadDelay);
            console.log("Started dublinbus scheduler");
        } else if (notification === "DUBLIN_BUS_TIMES_STOP_WORKER") {
            clearTimeout(this.updateTimer);
            console.log("Stopped dublinbus scheduler");
        }
    },

    scheduleUpdate: function (delay) {
        let nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        let self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function () {
            self.callDublinBus();
        }, nextLoad);
    },

    callDublinBus: function () {
        url = 'https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=' + this.config.stopNumber;
        let self = this;

        if (!validUrl.isUri(url)) {
            console.error("Invalid URL to Dublin bus: " + url);
            self.sendSocketNotification("DUBLIN_BUS_TIMES_UNKNOWN_ERROR");
            return;
        }

        https.get(url, (resp) => {
            if (resp.statusCode !== 200) {
                console.error("Dublin bus times not available. Response code: " + payload);
                self.sendSocketNotification("DUBLIN_BUS_TIMES_UNAVAILABLE");
                return;
            }

            resp.on('data', (d) => {
                self.processData(JSON.parse(d));
            });

        }).on('error', (e) => {
            console.error(e);
            self.sendSocketNotification("DUBLIN_BUS_TIMES_UNKNOWN_ERROR");
        });
    },

    processData: function (data) {
        times = [];

        for (let i = 0; i < data.results.length; i++) {
            let route = data.results[i].route;
            let duetime = data.results[i].duetime;

            if (duetime === "Due") {
                times.push(route + " is due!");
            } else {
                let minsMsg = null;
                if (duetime === "1") {
                    minsMsg = "min";
                } else {
                    minsMsg = "mins";
                }
                times.push(route + " - " + duetime + " " + minsMsg);
            }
        }
        if (times.length === 0) {
            times.push("There are no bus times available");
        }
        this.bustimes = times;
        this.broadcastDublinbusTimes();
        this.scheduleUpdate();
    },

    broadcastDublinbusTimes: function () {
        this.sendSocketNotification("DUBLIN_BUS_TIMES_RECEIVED", this.bustimes);
    }

});
