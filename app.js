var uniqueId = 1;

var myDatabase = firebase.database().ref('Markers/');


var titleHeader = document.getElementById("markerTitle")
var descriptionPara = document.getElementById("markerDescription")


// fireTitle.on('value', function(snapshot){
// 	titleHeader.innerText = snapshot.val();
// })
//
// fireDesc.on('value', function(snapshot){
// 	descriptionPara.innerText = snapshot.val();
// })

function getDatabaseData() {

	var markers = [];
	for (i=1;i<uniqueId;i++){
		var marker = {};
		var fireTitle = firebase.database().ref('Markers/' + i).child("title");
		fireTitle.on('value', function(snapshot){
		 	marker['title'] = snapshot.val();
		});
		var firePass = firebase.database().ref('Markers/' + i).child("password");
		firePass.on('value', function(snapshot){
		 	marker['password'] = snapshot.val();
		});		
		var fireDesc = firebase.database().ref('Markers/' + i).child("description");
		fireDesc.on('value', function(snapshot){
		 	marker['description'] = snapshot.val();
		});
		var fireCoffee = firebase.database().ref('Markers/' + i).child("coffee");
		fireCoffee.on('value', function(snapshot){
		 	marker['coffee'] = snapshot.val();
		});
		var fireLat = firebase.database().ref('Markers/' + i).child("latitude");
		fireLat.on('value', function(snapshot){
		 	marker['latitude'] = snapshot.val();
		});
		var fireLong = firebase.database().ref('Markers/' + i).child("longitude");
		fireLong.on('value', function(snapshot){
		 	marker['longitude'] = snapshot.val();
		});
		markers.push(marker);
	}
	createAndMapMarkersOnMap(markers);
}

function createAndMapMarkersOnMap(eventData) {
	for (i= 0;i< eventData.length;i++){

		marker = new google.maps.Marker({
      	map: map,
     	draggable: true,
     	animation: google.maps.Animation.DROP,
     	icon: url="http://maps.google.com/mapfiles/kml/shapes/info.png",
     	position: {lat: eventData[i]['latitude'], lng: eventData[i]['longitude']},
     	title:eventData[i]['title']
    });
		marker.addListener('click', function(){

	      var contentString = '';
	      // '<h1 style="text-align:center;">'+ eventData[i]['title'] +'</h1>'+
	      // '<p style="overflow:scroll;text-align:center;">'+ eventData[i]['description'] + '</p>' +
	      // eventData[i]['coffee'] +
	      // //'<ons-button modifier="large" onclick="checkPassword(formInfo, ' + marker.id + ')">Edit</ons-button>' +
	      // '</div>';
	      var infowindow = new google.maps.InfoWindow({
	        content: contentString
	      });
	      infowindow.open(map, marker);
	  });
}
}


function deleteData1(id)  {

	firebase.database().ref('Markers/'+ id).remove();
}


function deleteData() {
	firebase.database().ref('Markers/'+ '1').remove();
}

function saveFormInfo() { //Lägger till marker data till databasen
	markerId = uniqueId;
	uniqueId ++;

	var title = document.getElementById("formTitle").value;
	var password = document.getElementById("formPassword").value;
	var description = document.getElementById("formDescription").value;
	var latitude = 0;
	var longitude = 0;

	if ($('#coffee').prop('checked') == true) {
		var coffee = true;
	}else{
		var coffee = false;
	};

	var x = document.getElementById("map");
getLocation();
	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } else {
				alert("error");
	    }

		getDatabaseData();
	}

	function showPosition(position) {
			
	    latitude = position.coords.latitude;
	    longitude = position.coords.longitude;
	    
			firebase.database().ref('Markers/' + markerId).set({
		    title: title,
		    password: password,
		    description : description,
			coffee: coffee,
			latitude: latitude,
			longitude: longitude
		  });
			
		}

}

