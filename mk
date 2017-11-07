#!/bin/sh

children () {
  j=$(curl "$1") &&
  printf "%s" "$j" | jq . > children.json
}

children https://mapit.mysociety.org/area/2537/children

wards () {
  j=$(cat children.json |
      jq '.[] | select(.type | contains("MTW"))' ) &&
  printf "%s" "$j" > wards.json
}

wards

ids () {
  jq < wards.json -r .id
}

mkdir -p ward
for id in $(ids)
do
  (
  cd ward
  curl -O https://mapit.mysociety.org/area/"$id".geojson
  )
done
