
load = function(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4) { return }
    cb(xhr)
  }
  xhr.open('GET', url)
  xhr.send()
}

plot_wards = function(map, cb) {
  map_features(map, "wards.geojson", {cb: cb, gss_code: "gss"})
}

plot_lsoa = function(map, cb) {
  map_features(map, "E08000019.json", {cb: cb, gss_code: "LSOA11CD"})
}

map_features = function(map, file, o) {
  load(file, function(xhr) {
    var g = JSON.parse(xhr.responseText)
    for(var i in g.features) {
      var feature = g.features[i]
      var gss = feature.properties[o.gss_code]
      var options = (o.cb)(feature, gss)
      var area = L.geoJSON(feature, options)
      map.addLayer(area)
    }
  })
}

mapinate = function() {
  var mapdiv = document.querySelector("div.sheffmap")
  Map = L.map(mapdiv).setView([53.4, -1.5], 11);
  L.tileLayer(
    '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a','b','c']
      }
  ).addTo( Map );

  var dataURL = mapdiv.dataset.url
  var dataColumn = mapdiv.dataset.column || ""
  var dataLabel = window[mapdiv.dataset.label]
  var dataStyle = window[mapdiv.dataset.style]
  load(dataURL, function(xhr) {
    var data = {}
    try {
      data = JSON.parse(xhr.responseText)
    } catch(err) {
      console.log(err)
    }
    var key = Object.keys(data)[0]
    var plot
    if(/^E01/.test(key)) {
      // LSOA
      plot = plot_lsoa
    } else {
      // wards
      plot = plot_wards
    }
    plot(Map, function(feature, gss) {
      var d = data[gss] || {}
      var v = d[dataColumn]
      var style = { color: "black", weight: 1 }
      if(dataStyle) {
        var extraStyle = dataStyle(v, d, feature)
        Object.assign(style, extraStyle)
      }

      return {
        onEachFeature: function(feature, layer) {
          if(dataLabel) {
            var label = dataLabel(v, d, feature)
            layer.bindPopup(label)
          }
        },
        style: style
      }
    })
  })
}

