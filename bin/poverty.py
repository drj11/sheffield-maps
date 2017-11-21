#!/usr/bin/env python3

import csv
import json
import sys

j = json.load(open("wards.json"))
mapit = { v['name']: v for k,v in j.items() }

jout = {}
for row in csv.reader(open("fuel-poverty.csv")):
    lsoa = row[0]
    fraction = float(row[7])
    jout[lsoa] = dict(fuelpoverty=fraction)

with open("fuel-poverty.json", 'w') as out:
    json.dump(jout, out, indent=2)
