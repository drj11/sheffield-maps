#!/usr/bin/env python3

import csv
import glob
import json
import re
import sys

jout = {}

ward_info = json.load(open("wards.json"))

features = []

for fn in glob.glob("ward/*.geojson"):
    mapit_id = re.findall(r'[0-9]+', fn)[0]
    gss = ward_info[mapit_id]["codes"]["gss"]
    name = ward_info[mapit_id]["name"]
    geom = json.load(open(fn))
    d = dict(type="Feature",
         geometry=geom,
         properties={
           "mapit_id": mapit_id,
           "gss": gss,
           "name": name
         },
         id=gss
    )
    features.append(d)

collection = dict(type="FeatureCollection",
  features=features)
json.dump(collection, open("wards.geojson", 'w'), indent=2)
