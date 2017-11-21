# Maps

See the example maps:

[Index of Multiple Deprivation](imd.html)

[Local Election Turnout](turnout.html)

[Tree Canopy](canopy.html)

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
