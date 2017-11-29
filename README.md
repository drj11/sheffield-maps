# Sheffmap

Show a map of Sheffield using either
wards (local election) as boundaries, or
LSOA (for census data) as boundaries.

## Example maps

[Index of Multiple Deprivation](/sheffield-map/imd)

[Local Election Turnout](/sheffield-map/turnout)

[Tree Canopy](/sheffield-map/canopy)

To use this you must copy
`sheffmap.js` `E08000019.json` and `wards.geojson` into
a directory that will be served with your web application.

Your HTML should have a `<DIV>` with the class `sheffmap`,
and that `<DIV>` should have the following `data` attributes:

- `data-url` URL of your `JSON` file of data to show on your map.
- `data-column` the property whose value is displayed.
- `data-label` a function that returns a string used as a label.
- `data-style` a function that returns a style object.

The [tree canopy](/sheffield-map/canopy) example is one of the
simplest to start with.


## Notes and References

Sheffield City Council
https://mapit.mysociety.org/area/2537.html

children (as JSON):
https://mapit.mysociety.org/area/2537/children

Local Government areas are described by the
file [wards.json](wards.json) which is derived
from the mapit data.

## JSON files

`[E08000019.json]` GeoJSON file describing the LSOAs for
the Metropolitan Borough of Sheffield.
It is a GeoJSON `FeatureCollection`;
each `Feature` has in its `properties` table:
- `LSOA11CD`
- `LSOA11NM`

`[wards.json]` is a table describing all the wards in Sheffield.
The keys of this table are IDs used by the mapit project.
