# MMM-Dublin-Bus
Magic Mirror Module - Dublin Bus

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). Displays bus times for a configurable stop. This uses the [Dublin Bus API](https://data.gov.ie/dataset/real-time-passenger-information-rtpi-for-dublin-bus-bus-eireann-luas-and-irish-rail), therefor is only useful within Dublin, Ireland.

This module is intended to be activated and deactivated from the use of other Smart Mirror Modules, using Smart Mirror's notification module. Dublin Bus API most likely has rate limiting in place, so having the module being displayed on the main page of the Smart Mirror constantly calling the API could cause problems.

To get around this, MMM-Dublin-Bus module makes use of Smart Mirror's default alert module to display Dublin bus times. This can be triggered on or off from other modules by sending the notifications `DUBLINBUS_START` and `DUBLINBUS_STOP`. Currently this module is integrated and works with [MMM-Voice-Control](https://github.com/dr4ke616/MMM-Voice-Control) 

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute

```bash
git clone https://github.com/dr4ke616/MMM-Dublin-Bus.git
```

2. Execute `npm install` to install the node dependencies.
4. Start magic mirror

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
    {
        module: 'MMM-Dublin-Bus',
        config: {
            stopNumber: <LOCAL_STOP_NUMBER>
            // See 'Configuration options' for more information.
        }
    }
]
```

## Configuration Options

- Set the `language`, default is set to `en`
- Set the stop number with the `stopNumber` value. Stop numbers can be found on the [Dublin Bus Route Planner](https://www.dublinbus.ie/Route-Planner/)
- The `updateInterval` is used to determine the polling frequency of the Dublin Bus API. The default is set to 10 seconds.