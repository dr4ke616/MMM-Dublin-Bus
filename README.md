# MMM-Dublin-Bus
Magic Mirror Module - Dublin Bus

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It displays bus times for a configurable stop. This uses the [Dublin Bus API](https://data.gov.ie/dataset/real-time-passenger-information-rtpi-for-dublin-bus-bus-eireann-luas-and-irish-rail), therefor is only useful within Dublin, Ireland. Warning when using this module. There may be API rate limiting in place as it is a free to use API.

## Installation

- Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/dr4ke616/MMM-Dublin-Bus.git`.
- Install the dependancies with `npm install`
- Configure the module as mentioned below.
- Start magic mirror

## Using the module

This module can display times either through Magic Mirror's Dom tree or through using Magic Mirror's alert module. It can started or stopped using Magic Mirror's internal notification system, enabling the ability for other modules to control when it reads off Dublin Bus' API. The two notifications MMM-Dublin-Bus will listen to are `DUBLINBUS_START` and `DUBLINBUS_STOP`.

Once installed, to use it add it to the modules array in the `config/config.js` file:

```javascript
modules: [
    {
        module: 'MMM-Dublin-Bus',
        config: {
            stopNumber: <LOCAL_STOP_NUMBER>,
            mode: "dom"
            // See 'Configuration options' for more information.
        }
    }
]
```

## Configuration Options

The following properties can be configured, as well as any of the default Magic Mirror configuration [settings](https://github.com/MichMich/MagicMirror#configuration).

| Option 			| Default 			| Description 																																																								|
|-------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`mode`				| `dom`				|The options supported are either `dom` or `alert`. This sets how the bus times are to be displayed. In `alert` mode all times are displayed using Magic-Mirror's notification system. In `dom` mode it is displayed on the main screen 	|
|`stopNumber` 		| No default value 	|Stop numbers can be found on the [Dublin Bus Route Planner](https://www.dublinbus.ie/Route-Planner/)																																		|
|`updateInterval` 	| `10000` 			|An `int` value to set the API polling interval in seconds																																													|
