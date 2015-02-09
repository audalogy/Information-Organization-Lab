var map;

$(document).ready(function() {
    map = L.map('map').setView([40.7973462, -99.8774176], 4);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery c <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 13
    }).addTo(map);
})

function getLatestData() {
    var request = $.getJSON(
        "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
        function(data) {
            buildTable(data);
			markupMap(data);
        }
        // Attempt to pan to location on map when clicking a row
        // tclick = $('#dataTable').find('tr');
        // tclick.bind('click', function(event) {  
        //     lat = $(this).find("td.lat");
        //     lng = $(this).find("td.lng");
        //     map.panTo([$(this).attr(lat,lng)]);
        // };
    );
}

function markupMap(data) {
	var maxLong;
	var maxLat;
	var maxMag = 0;
	var maxMarker;
	//
    for (var i = 0; i < data.features.length; i++) {
		var lng = data.features[i].geometry.coordinates[0];
		var lat = data.features[i].geometry.coordinates[1];
		var marker = L.marker([lat, lng]).addTo(map);
		//
        var circle = L.circle([lat, lng], 1000*data.features[i].properties.mag, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3
        }).addTo(map);
        //
		var mag = data.features[i].properties.mag;
		var info = "Time: " + new Date(data.features[i].properties.time).toLocaleString() + "<br />";
        var link = data.features[i].properties.url;
		info += "Magnitude: " + mag + "<br />" + "Earthquake Summary URL: " + link + "<br />";
		marker.bindPopup(info);
		//
		if(mag > maxMag) {
			maxLong = lng;
			maxLat = lat;
			maxMag = mag;
			maxMarker = marker;
		}
    }
	maxMarker.openPopup();
	map.setView([maxLat, maxLong], 4);
}

function buildTable(data) {
    for (var i = 0; i < data.features.length; i++) {
        // var lat = data.features[i].geometry.coordinates[1];
        // var lng = data.features[i].geometry.coordinates[0];
        var record = $("<tr></tr>")
            .append("<td>" + data.features[i].properties.place + "</td>")
            .append("<td>" + new Date(data.features[i].properties.time).toLocaleString() + "</td>")
            .append("<td>" + data.features[i].properties.mag + "</td>")
            .append("<td>" + data.features[i].geometry.coordinates[2] + " km</td>")
            // .append("<td class=lat>" + lat + "</td>")
            // .append("<td class=lat>" + lng + "</td>")
            .append("<td>" + nullChecker(data.features[i].properties.felt) + "</td>")
            .append("<td>" + nullChecker(data.features[i].properties.alert) + "</td>")
            .append("<td>" + nullChecker(data.features[i].properties.tsunami) + "</td>")
        $(".table").append(record);
    }
}

// Check whether the given value is null or not
function nullChecker(value) {
    if (value) {
        return value;
    } else {
        return "-";
    }
}