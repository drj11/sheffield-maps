sheffmapURL = document.currentScript.src
sheffmapURL = sheffmapURL.replace('sheffmap.js', '')
sheffmapWards = sheffmapURL + "wards.geojson"
sheffmapLSOA = sheffmapURL + "E08000019.json"

CSV = {}
CSV.rows = function (text) {
  var t = text.replace(/\r\n/g, "\n")
  var CSV_RE = /[^",\r\n]+(,|\n)|"(?:[^"]|"")*"(,|\n)|(,|\n)/g

  var rows = []
  var row = []
  while(1) {
    var m = CSV_RE.exec(t)
    if(m == null) {
      break
    }
    if(row.length == 0) {
      rows.push(row)
    }
    var item = m[0]
    var rowEnd = /\n$/.test(item)
    item = item.substr(0, item.length-1)

    row.push(item)
    if(rowEnd) {
      row = []
    }
  }
  return rows
}

CSV.parse = function(text) {
  var rows = CSV.rows(text)
  var headers = rows[0]
  var rows = rows.slice(1)
  var res = []
  for(var i=0; i<rows.length; i++) {
    var row = rows[i]
    var d = {}
    for(var j=0; j<headers.length; j++) {
      d[headers[j]] = row[j]
    }
    res.push(d)
  }
  return res
}

load = function(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState < 4) { return }
    cb(xhr)
  }
  xhr.open('GET', url)
  xhr.send()
}

plot_wards = function(map, cb, then) {
  map_features(map, sheffmapWards,
    {eachFeature: cb, gss_code: "gss", then: then})
}

plot_lsoa = function(map, cb, then) {
  map_features(map, sheffmapLSOA,
    {eachFeature: cb, gss_code: "LSOA11CD", then: then})
}

// This function is called via either plot_wards() or plot_lsoa().
// map: a Leaflet map
// file: a URL, the GeoJSON data
// option: a struct containing options: {
//   gss_code: the name of the property containing the GSS code
//   eachFeature: a callback function, called for each GeoJSON feature
// }
map_features = function(map, file, option) {
  load(file, function(xhr) {
    var g = JSON.parse(xhr.responseText)
    for(var i in g.features) {
      var feature = g.features[i]
      var gss = feature.properties[option.gss_code]
      var featureOptions = (option.eachFeature)(feature, gss)
      var area = L.geoJSON(feature, featureOptions)
      map.addLayer(area)
    }
    if(option.then) {
      (option.then)()
    }
  })
}

mapinate = function(then) {
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
      if(/\.csv$/.test(xhr.responseURL)) {
        var a = CSV.parse(xhr.responseText)
        for(var i=0; i<a.length; i++) {
          data[a[i].gss] = a[i]
        }
      } else {
        data = JSON.parse(xhr.responseText)
      }
    } catch(err) {
      console.log(err)
    }


    // Fix the `then` callback.
    if(!then) {
      then = function(){}
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
    },
    then(Map)
    )
  })
}
