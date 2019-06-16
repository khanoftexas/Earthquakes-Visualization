var earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// console.log (earthquakes_url)
var plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// console.log (plates_url)

function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(earthquakes_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var faultlines = new L.LayerGroup();

d3.json(plates_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'orange'
            }
        },
    }).addTo(faultlines);
})


function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return '#FF8C00'
    } else if (magnitude > 2) {
        return '#FFBF00'
    } else if (magnitude > 1) {
        return 'yellow'
    } else {
        return 'lightgreen'
    }
};

function createMap() {
   
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
    var dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });

    var baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors,
        "Dark": dark       
    };

    var overlays = {
        "Fault Lines": faultlines,
        "Earthquakes": earthquakes,
        
    };

    var mymap = L.map('map-id', {
        center: [37.8968, -119.5828],
        zoom: 3.3,
        layers: [satellite, earthquakes, faultlines]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
 
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

         for (var i = 0; i < magnitude.length; i++) {
             div.innerHTML +=
             '<div class="color-box" style="background-color:' + Color(magnitude[i] + 1) + ';"></div> '+ 
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);

    // add name    
    var author = L.control({ position: 'bottomleft' });
    author.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'name');

    div.innerHTML = '<div style="color:Red"> Ehsan Khan </div>';
    return div;
    };
    author.addTo(mymap);
    }

