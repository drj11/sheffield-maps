
load = function(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4) { return }
    cb(xhr)
  }
  xhr.open('GET', url)
  xhr.send()
}

plot_wards = function(map, ward_cb) {
  load("wards.geojson", function(xhr) {
    var g = JSON.parse(xhr.responseText)
    for(var i in g.features) {
      var feature = g.features[i]
      var options = ward_cb(feature)
      var area = L.geoJSON(feature, options)
      map.addLayer(area)
    }
  })
}

plot_lsoa = function(map, lsoa_cb) {
  load("E08000019.json", function(xhr) {
    var g = JSON.parse(xhr.responseText)
    for(var i in g.features) {
      var feature = g.features[i]
      var options = lsoa_cb(feature)
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
  var dataColumn = mapdiv.dataset.column
  var dataLabel = window[mapdiv.dataset.label]
  var dataStyle = window[mapdiv.dataset.style]
  load(dataURL, function(xhr) {
    var data = JSON.parse(xhr.responseText)
    var key = Object.keys(data)[0]
    if(/^E01/.test(key)) {
      // LSOA
      plot_lsoa(Map, function(feature) {
        var lsoa11cd = feature.properties.LSOA11CD
        var d = data[lsoa11cd]
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
    } else {
      plot_wards(Map, function(feature) {
        var gss = feature.properties.gss
        var d = data[gss]
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
    }
  })
}

