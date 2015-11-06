/* MAPBOX */

loc = "oakland"
placeholder = "Enter Location"

nodice = function(){
  $('.acquired').html("No Dice on the Satellite, try somewhere in California.").css('color', 'red');
  $('.planetthumb').attr("src", "no_dice.png")
}

function newLoc(){
  event.preventDefault();
  loc = document.locform.locinput.value
  getGeoJson();
}

mapboxKey = "pk.eyJ1IjoibWNlb2luIiwiYSI6ImNpZ2p0d29vcTAwODV1MWtyMjEyZGx1ejYifQ.e5vXnx4Hm0f0hbgUGFx78A"

mapboxRequest = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+loc+".json?access_token="+mapboxKey

updateMapboxRequest = function(){
  mapboxRequest = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+loc+".json?access_token="+mapboxKey
}

getGeoJson = function(){

  updateMapboxRequest();
  $.ajax({
    url: mapboxRequest,
    success: function(data) {
        responseObject = data.features[0]
        if (responseObject){
          responseBox = responseObject.bbox
          responseLatLong = responseObject.center
          responseName = responseObject.place_name
          $('.geojsonbox').html("bbox: "+responseBox)
          $('.geojsoncenter').html("lat/long: " + responseLatLong)
          $('.locationname').html(responseName)
          planetLabs();
        }
        else {
          nodice();
        }
    },
  });
}

/* PLANET LABS */
planetLabs = function(){

  var url = "https://api.planet.com/v0/scenes/ortho/";
  var key = 'd68202514a1c4a28adb429370e2017e6';

  if (responseBox){
    var sf_nw = Array(responseBox[0], responseBox[1])
    var sf_se = Array(responseBox[2], responseBox[3])
    var sf_ne = [sf_se[0], sf_nw[1]];
    var sf_sw = [sf_nw[0], sf_se[1]];
    var bounds = [sf_nw, sf_ne, sf_se, sf_sw, sf_nw];

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
            first_object = data.features[0]
            acquired = (new Date(first_object.properties.acquired)).toString()
            $('.acquired').html("Photo Taken: " + acquired).css('color', 'black');
            ortho_id = (first_object.id)
            planetUrl = "https://api.planet.com/v0/scenes/ortho/"+ortho_id+"/square-thumb?size=lg"
            $('.planetthumb').attr("src", planetUrl)
        },
    });

  } else {
    nodice();
  }


}