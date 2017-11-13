#!/usr/bin/env python3

import csv
import json
import sys

j = json.load(open("wards.json"))
mapit = { v['name']: v for k,v in j.items() }

jout = {}
for row in csv.reader(open("2016turnout.csv")):
    text_name = row[0]

    assert text_name in mapit
    gss = mapit[text_name]['codes']['gss']

    row[1] = int(row[1])
    row[2] = float(row[2])

    d = dict(zip(["name", "poll", "turnout"], row))
    d['gss'] = gss
    jout[gss] = d

with open("2016turnout.json", 'w') as out:
    json.dump(jout, out, indent=2)
