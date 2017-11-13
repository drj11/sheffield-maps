#!/bin/sh

Key=$(cat .mapit) || exit 99

children () {
  j=$(curl "$1"?api_key="$Key") &&
  printf "%s" "$j" | jq . > children.json
}

children https://mapit.mysociety.org/area/2537/children

wards () {
  j=$(
    jq < children.json 'with_entries(select(.value |.type | contains("MTW")))'
    ) &&
  printf "%s" "$j" | jq . > /dev/null &&
  printf "%s" "$j" > wards.json
}

wards

ids () {
  jq < wards.json -r '.[] | .id'
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

curl -O https://raw.githubusercontent.com/drj11/sheffield-local-elections/master/out/2016turnout.csv
