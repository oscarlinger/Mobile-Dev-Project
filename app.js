var uniqueId = 0;
var myDatabase = firebase.database().ref('standsoncampus/');
var numOfMarkers = 0;
var markers = [];

function getDatabaseData() {
	myDatabase.once("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
          	var marker = {};
             marker.title = childSnapshot.val().title;
             marker.password = childSnapshot.val().password;
             marker.description = childSnapshot.val().description;
             marker.coffee = childSnapshot.val().coffee;
             marker.latitude = childSnapshot.val().latitude;
             marker.longitude = childSnapshot.val().longitude;
             marker.id = childSnapshot.val().id;
            markers.push(marker);  
          });
  		createAndMapMarkersOnMap(markers);
	});
  }

function createAndMapMarkersOnMap(eventData) {
	for (i=0;i<eventData.length;i++){
		var latitude = eventData[i]['latitude'];
		var longitude = eventData[i]['longitude'];
		var title = eventData[i]['title'];
		var description = eventData[i]['description'];
		var coffee = eventData[i]['coffee'];
		var id = eventData[i]['id'];
		var contentString ='<h1 style="text-align:center;">'+ title +
						   '</h1><p style="overflow:auto;text-align:center;">'+ 
						   description + '</p>' + coffee + 
						   '<ons-button modifier="large" onclick="deleteMarkerData('+id+')">Delete</ons-button></div>';
		marker = new google.maps.Marker({
	      	map: map,
	     	draggable: true,
	     	animation: google.maps.Animation.DROP,
	     	icon: url="http://maps.google.com/mapfiles/kml/shapes/info.png",
	     	position: {lat: latitude, lng: longitude},
	     	title:eventData[i]['title']
    		});
		map.setCenter({lat: latitude, lng: longitude} );
		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', (function(marker, contentString, infowindow){
			return function(){
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
				};
			})(marker, contentString, infowindow));
		}
	}

function deleteMarkerData(id)  {
	var firePass = firebase.database().ref('standsoncampus/' + id).child("password");
 		firePass.on('value', function(snapshot){
 			//var password = snapshot.val();
 			if (prompt("Password") == snapshot.val()) {
 				console.log('hej');
      			firebase.database().ref('standsoncampus/' + id).remove();
    		} else {
      			//alert("The password you entered was incorrect.");
   		 }
 	});
	
	}
	
function saveFormInfo() { //Lägger till marker data till databasen
	var title = document.getElementById("formTitle").value;
	var password = document.getElementById("formPassword").value;
	var description = document.getElementById("formDescription").value;
	var latitude = 59.35020989999999;
	var longitude = 18.0693072;
	var id = Math.floor(Math.random() * 100000);

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
	    firebase.database().ref('standsoncampus/' + id).set({
	    	title: title,
	    	password: password,
	    	description : description,
	    	coffee: coffee,
	    	latitude: latitude,
	    	longitude: longitude,
	    	id: id
	    });

	}
	function showPosition(position) {
	    latitude = position.coords.latitude;
	    longitude = position.coords.longitude;
		}
}

