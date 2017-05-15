// FIREBASE DATABASE FOR MARKER INFORMATION
var myDatabase = firebase.database().ref('standsoncampus/');

// GET MARKER OBJECTS FROM FIREBASE DATABASE
function getDatabaseData() {
	var markers = [];
	myDatabase.once("value", function(snapshot) {
		// LOOP THROUGH DATABASE AND SAVE MARKER INFO LOCALLY
          snapshot.forEach(function(childSnapshot) {
          	// CREATE EACH MARKER AS DICT
          	var marker = {};
             marker.title = childSnapshot.val().title;
             marker.password = childSnapshot.val().password;
             marker.description = childSnapshot.val().description;
             marker.coffee = childSnapshot.val().coffee;
             marker.latitude = childSnapshot.val().latitude;
             marker.longitude = childSnapshot.val().longitude;
             marker.id = childSnapshot.val().id;
             // SAVE EACH MARKERS TO ARRAY
            markers.push(marker);  
          });
        // SEND, CREATE AND MAP MARKERS ON MAP
  		createAndMapMarkersOnMap(markers);
	});
  }

// CREATES AND MAPS MARKERS ON MAP FROM getDatabaseData()
function createAndMapMarkersOnMap(eventData) {
	// LOOP THROUGH LOCALLY SAVED MARKER INFORMATION
	for (i=0;i<eventData.length;i++){
		// SAVE MARKER OBJECT INFO TO VARIABLES
		var latitude = eventData[i]['latitude'];
		var longitude = eventData[i]['longitude'];
		var title = eventData[i]['title'];
		var description = eventData[i]['description'];
		var coffee = eventData[i]['coffee'];
		var id = eventData[i]['id'];
		// PUT INFORMATION IN INFOWINDOW
		var contentString ='<h1 style="text-align:center;">'+ title +
						   '</h1><p style="overflow:auto;text-align:center;">'+ 
						   description + '</p>' + coffee + 
						   '<ons-button modifier="large" onclick="deleteMarkerData('+id+')">Delete</ons-button></div>';
		// CREATE MARKER
		marker = new google.maps.Marker({
	      	map: map,
	     	draggable: true,
	     	animation: google.maps.Animation.DROP,
	     	icon: url="http://maps.google.com/mapfiles/kml/shapes/info.png",
	     	position: {lat: latitude, lng: longitude},
	     	title:eventData[i]['title']
    		});
		// FOCUS MAP ON MARKER POSITION
		map.setCenter({lat: latitude, lng: longitude} );
		var infowindow = new google.maps.InfoWindow();
		// OPEN INFOWINDOW IF MARKER IS CLICKED
		google.maps.event.addListener(marker, 'click', (function(marker, contentString, infowindow){
			return function(){
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
				};
			})(marker, contentString, infowindow));
		}
	}

// DELETE SELECTED MARKER IF PASSWORD IS CORRECT
function deleteMarkerData(id)  {
 	// CHECK PASSWORD
	var firePass = firebase.database().ref('standsoncampus/' + id).child("password");
 		firePass.on('value', function(snapshot){
 			// DELETE MARKER IF PASSWORD IS CORRECT
 			if (prompt("Password") == snapshot.val()) {
      			firebase.database().ref('standsoncampus/' + id).remove();
      			window.location.reload(true);
    		} else {
      			alert("The password you entered was incorrect.");
   		 }
 	});
	}

// SEND INFORMATION FROM FORM TO FIREBASE DATABASE
function saveFormInfo() {
	// SAVE FORM INFO 
	var title = document.getElementById("formTitle").value;
	var password = document.getElementById("formPassword").value;
	var description = document.getElementById("formDescription").value;
	// SET DEFAULT MARKER POSITION IF USER WON'T ALLOW POSITIONING
	var latitude = 59.34020989999999;
	var longitude = 18.0693072;
	var id = Math.floor(Math.random() * 100000);
	if ($('#coffee').prop('checked') == true) {
		var coffee = true;
	}else{
		var coffee = false;
	};
	var x = document.getElementById("map");
	// GET USER POSITION
	getLocation();
	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } else {
				alert("error");
	    }
	}
	// SEND FORM INFO TO FIREBASE DATABASE
	function showPosition(position) {
		// SAVE USER COORDINATES
	    latitude = position.coords.latitude;
	    longitude = position.coords.longitude;
	    firebase.database().ref('standsoncampus/' + id).set({
	    	title: title,
	    	password: password,
	    	description : description,
	    	coffee: coffee,
	    	latitude: latitude,
	    	longitude: longitude,
	    	id: id
	    });
	    	// UPDATE PAGE TO LOAD MARKER
 			window.location.reload(true);
		}
}

