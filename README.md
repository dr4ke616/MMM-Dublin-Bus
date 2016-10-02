# MMM-Dublin-Bus
Magic Mirror Module - Dublin Bus

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It displays bus times for a configurable stop. This uses the [Dublin Bus API](https://data.gov.ie/dataset/real-time-passenger-information-rtpi-for-dublin-bus-bus-eireann-luas-and-irish-rail), therefor is only useful within Dublin, Ireland. Warning when using this module. There may be API rate limiting in place as it is a free to use API.

## Installation

- Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/dr4ke616/MMM-Dublin-Bus.git`.
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

The following properties can be configured:

<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>

		<tr>
			<td><code>mode</code></td>
			<td>The options supported are either <code>dom</code> or <code>alert</code>. This sets how the bus times are to be displayed. In <code>alert</code> all times are displayed using Magic-Mirror's notification system. In <code>dom</code> mode it is displayed on the main screen.<br>
				<br><b>Example:</b> <code>alert</code>
				<br><b>Default value:</b> <code>dom</code>
			</td>
		</tr>

		<tr>
			<td><code>language</code></td>
			<td>The language used.<br>
				<br><b>Example:</b> <code>en</code>
				<br><b>Default value:</b> <code>en</code>
			</td>
		</tr>

		<tr>
			<td><code>stopNumber</code></td>
			<td>Stop numbers can be found on the <a href="https://www.dublinbus.ie/Route-Planner/">Dublin Bus Route Planner</a>.<br>
				<br><b>Possible Values:</b> <code>int</code> value
				<br><b>Default value:</b> No default value
			</td>
		</tr>

		<tr>
			<td><code>updateInterval</code></td>
			<td>Polling frequency of the Dublin Bus API.<br>
				<br><b>Possible Values:</b> <code>int</code>, <code>float</code> value
				<br><b>Default value:</b> <code>10000</code> (10 seconds)
			</td>
		</tr>

	</tbody>
</table>
