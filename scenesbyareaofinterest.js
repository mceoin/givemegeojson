var url = "https://api.planet.com/v0/scenes/ortho/";
var key = 'd68202514a1c4a28adb429370e2017e6';

// [longitude, latitude]
var sf_nw = [-122.545373, 37.815798];
var sf_se = [-122.340066, 37.709403];
var sf_ne = [sf_se[0], sf_nw[1]];
var sf_sw = [sf_nw[0], sf_se[1]];
var bounds = [sf_nw, sf_ne, sf_se, sf_sw, sf_nw];

// // Using WKT

var bounds_joined = [];

for (var i=0; i<bounds.length; i++) {
    bounds_joined.push(bounds[i].join(' '));
}

var intersects = "POLYGON((" + bounds_joined.join(', ') + "))";

// Or, using GeoJSON

// var intersects = JSON.stringify({
//     "type": "Feature",
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [bounds]
//     }
// });

// Back to shared code between WKT and GeoJSON

var params = {
    intersects: intersects
};

// With Jquery

var auth = "Basic " + btoa(key + ":");

$.ajax({
    url: url,
    data: params,
    headers: {
        "Authorization": auth
    },
    success: function(data) {
        // do something with data.features here
        console.log(data.features)
    },
});
