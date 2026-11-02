import diff from './src/index.js'

const before = `The Rocky Mountains stretch some 3,000 miles from British Columbia down to New Mexico, forming the spine of western North America.
They were formed during the Laramide orogeny, roughly 80 to 55 million years ago.

Many peaks exceed fourteen thousand feet, and the range hosts some of the continent's most dramatic weather.
Grizzly bears, elk, and bighorn sheep roam the subalpine forests.
The treeline sits at about 11,500 feet in Colorado, dropping lower as you travel north.

Mining drove the first wave of settlement in the 1860s, leaving ghost towns scattered through the high valleys.
The silver crash of 1893 emptied many of them almost overnight.
Tourism arrived with the railroads, and never really left.

Snowmelt from the Rockies feeds the Colorado, the Missouri, the Rio Grande, and the Columbia, making the range the water tower of the American West.

The end.`

const after = `The Rocky Mountains stretch some 3,000 miles from British Columbia down to New Mexico, forming the spine of western North America.
They were formed during the Laramide orogeny, roughly 80 to 55 million years ago.

Many peaks exceed fourteen thousand feet, and the range hosts some of the continent's most dramatic weather.
Wolverines, elk, and bighorn sheep roam the subalpine forests.
The treeline sits at about 11,500 feet in Colorado, dropping lower as you travel north.
Above it, only krummholz and tundra survive the wind.

Snowmelt from the Rockies feeds the Colorado, the Missouri, the Rio Grande, and the Columbia, making the range the water tower of the American West — a single storm on the divide can send water toward three different oceans, depending on which side of the ridge it falls.

The end.`

await diff(before, after)
console.log('closed')
