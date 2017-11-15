#!/usr/bin/env python3

import csv
import json

jout = {}

for row in csv.reader(open("2015imd.csv")):
    lsoa, name, _, _, rank, decile = row
    if not name.startswith("Sheffield"):
        continue
    decile = int(decile)
    jout[lsoa] = { "lsoa": lsoa,
                   "name": name,
                   "decile": decile,
                 }

json.dump(jout, open("2015imd.json", 'w'), indent=2)
