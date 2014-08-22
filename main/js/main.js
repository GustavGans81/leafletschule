var map = L.map('map', {
});


var streetLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'Map data &copy; <a href=\'http://openstreetmap.org\'>OpenStreetMap</a> ' +
        'contributors, <a href=\'http://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, ' +
        'Imagery © <a href=\'http://mapbox.com\'>Mapbox</a>',
    id: 'examples.map-i86knfo3'
});


map.setView([49.002, 8.394], 8);
map.setMaxBounds([
    [55.732910, 15.490723],
    [46.973370, 4.707642]
]);

var satelliteLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/' +
    'World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    minZoom: 6,
    attribution: 'Map data &copy; <a href=\'http://openstreetmap.org\'>OpenStreetMap</a> ' +
        'contributors, <a href=\'http://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, ' +
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, ' +
        'Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
satelliteLayer.addTo(map);
streetLayer.addTo(map);

//L.marker([49.002, 8.394]).addTo(map);
var synyxLayer;
var createSynyxLayer = function (data) {
    synyxLayer = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {title: feature.properties.name});
        }
    });
    synyxLayer.addTo(map);
}
$.getJSON('data/synyx_aussenstellen.json', createSynyxLayer);

var bundeslandLayer;
var createBundeslandLayer = function (data) {
    bundeslandLayer = L.geoJson(data, {
        onEachFeature: onEachArea,
        style: {
            fillOpacity: 0.2,
                fillColor: '#b2c900',
                color: '#495537',
            opacity: 0.5,
            weight: 3
        }
    });
    bundeslandLayer.addTo(map);
}
$.getJSON('data/bundeslaender.json', createBundeslandLayer);

setTimeout(function () {
    layermodel.baseLayers.satellite = satelliteLayer;
    layermodel.baseLayers.street = streetLayer;
    layermodel.overlayLayers['Bundesl&aumlnder'] = this.bundeslandLayer;
    layermodel.overlayLayers['synyx Aussenstellen'] = this.synyxLayer;

    L.control.layers(layermodel.baseLayers, layermodel.overlayLayers).addTo(map);
}, 500);

var onEachArea = function (feature, area) {
    area.on({
        mouseover: function (e) {
            e.target.setStyle({
                fillOpacity: 0.5
            })
        },
        mouseout: function (e) {
            e.target.setStyle({
                fillOpacity: 0.2
            })
        }

    });
}


//L.marker([4236258.47, 5435700.12]).addTo(map);
proj4.defs('meineProjektion', '+proj=tmerc +lat_0=0 +lon_0=12 +k=1' +
    ' +x_0=4500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs');
var schnapsLayer;
var schnapsIcon = L.icon({
    iconUrl: 'img/Schnaps_klein.png',
    iconAnchor: [20,20]
});
var createSchnaps = function (data) {
    schnapsLayer = L.Proj.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: schnapsIcon});
        }
    });
    schnapsLayer.addTo(map);
}
$.getJSON('data/schnapsvorrat.json', createSchnaps);


