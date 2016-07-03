# MMM-Dublin-Bus
Magic Mirror Module - Dublin Bus

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). Displays bus times for a configurable stop. This uses the [Dublin Bus API](https://data.gov.ie/dataset/real-time-passenger-information-rtpi-for-dublin-bus-bus-eireann-luas-and-irish-rail), therefor is only useful within Dublin, Ireland.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/dr4ke616/MMM-Dublin-Bus.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the node dependencies.
4. Start magic mirror

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-Dublin-Bus',
        config: {
            // See 'Configuration options' for more information.
        }
    }
]
````
