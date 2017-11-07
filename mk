#!/bin/sh

Key=$(cat .mapit) || exit 99

echo $Key

children () {
  j=$(curl "$1"?api_key="$Key") &&
  printf "%s" "$j" | jq . > children.json
}

children https://mapit.mysociety.org/area/2537/children

wards () {
  j=$( jq < children.json '.[] | select(.type | contains("MTW"))' ) &&
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
  jq < "$id".geojson . > /dev/null ||
    ( sleep 0.4
      curl -O -H "X-Api-Key: $Key" https://mapit.mysociety.org/area/"$id".geojson
    )
  )
done
