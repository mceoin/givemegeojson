var url = "https://api.planet.com/v0/scenes/ortho/";
var key = 'd68202514a1c4a28adb429370e2017e6'; // keep this private

var params = {
    order_by: 'acquired desc'
};

// With Jquery

var auth = "Basic " + btoa(key + ":");

$.ajax({
    url: url,
    headers: {
        "Authorization": auth
    },
    success: function(data) {
        // do something with data.features here
        console.log(data.features)
        var next = data.links.next;
        if (next) {console.log(next)}
    },
    data: params,
});

// With NPM Request

var request = require('request');
var auth = "Basic " + new Buffer(key + ":").toString("base64");

request({
    url: url,
    qs: params,
    method: "GET",
    headers : {
        "Authorization" : auth
    }
}, function (error, response, body) {
    if (!error) {
        var data = JSON.parse(body);
        // do something with data.features here
    }
});
