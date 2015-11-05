// /* MAPBOX CODE */

loc = "oakland"
placeholder = "Enter Location"

function newLoc(){
  console.log("newLoc firing")
  event.preventDefault();
  loc = document.locform.locinput.value
  getGeoJson();
}

mapboxKey = "pk.eyJ1IjoibWNlb2luIiwiYSI6ImNpZ2p0d29vcTAwODV1MWtyMjEyZGx1ejYifQ.e5vXnx4Hm0f0hbgUGFx78A"

mapboxRequest = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+loc+".json?access_token="+mapboxKey

updateMapboxRequest = function(){
  mapboxRequest = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+loc+".json?access_token="+mapboxKey
}

console.log("mapboxRequest: " + mapboxRequest)

var response = null;
var responseObject = null;
var responseBox = null;
var responseName = null;

getGeoJson = function(){
  updateMapboxRequest();
  $.ajax({
    url: mapboxRequest,
    // data: params,
    // headers: {
    //     "Authorization": auth
    // },
    success: function(data) {
        // do something with data.features here
        console.log(data)
        responseObject = data.features[0]
        responseBox = responseObject.bbox
        console.log("responseBox: "+responseBox)
        responseName = responseObject.place_name
        console.log("responseName: "+responseName)
        planetLabs();
    },
  });
}

/* PLANET LABS CODE */
planetLabs = function(){

  var url = "https://api.planet.com/v0/scenes/ortho/";
  var key = 'd68202514a1c4a28adb429370e2017e6';

  // [longitude, latitude]
  // var sf_nw = [-122.545373, 37.815798];
  var sf_nw = Array(responseBox[0], responseBox[1])
  // var sf_se = [-122.340066, 37.709403];
  var sf_se = Array(responseBox[2], responseBox[3])
  var sf_ne = [sf_se[0], sf_nw[1]];
  var sf_sw = [sf_nw[0], sf_se[1]];
  var bounds = [sf_nw, sf_ne, sf_se, sf_sw, sf_nw];

  // // Using WKT

  var bounds_joined = [];

  for (var i=0; i<bounds.length; i++) {
      bounds_joined.push(bounds[i].join(' '));
  }

  var intersects = "POLYGON((" + bounds_joined.join(', ') + "))";

  var params = {
      intersects: intersects
  };

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
          ortho_id = (data.features[0].id)
          console.log("ortho_id: " + ortho_id)
          planetUrl = "https://api.planet.com/v0/scenes/ortho/"+ortho_id+"/square-thumb?size=lg"
          loadNewSatImg = function(){
            console.log("loadNewSatImg")
            $('.planetthumb').attr("src", planetUrl)
          }
          loadNewSatImg();
      },
  });
}