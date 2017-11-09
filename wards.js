var Map = L.map('mapid').setView([53.4, -1.5], 11);

L.tileLayer(
'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a','b','c']
        }).addTo( Map );

load = function(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4) { return }
    cb(xhr)
  }
  xhr.open('GET', url)
  xhr.send()
}

add_geojson = function(map, url, descriptor, cb) {
  load(url, function(xhr) {
    var g = JSON.parse(xhr.responseText)
    var options = cb(g, descriptor)
    var area = L.geoJSON(g, options)
    map.addLayer(area)
    // map.fitBounds(area.getBounds());
  })
}

plot_wards = function(map, ward_cb) {
  load("wards.json", function(xhr) {
    wards = JSON.parse(xhr.responseText)
    for(var id in wards) {
      add_geojson(map, "ward/" + id + ".geojson", wards[id], ward_cb)
    }
  })
}

