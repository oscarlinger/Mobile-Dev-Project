




var uniqueId = 1;


var myDatabase = firebase.database().ref('Markers/');



var titleHeader = document.getElementById("markerTitle")
var descriptionPara = document.getElementById("markerDescription")

list2 = [];




// fireTitle.on('value', function(snapshot){
// 	titleHeader.innerText = snapshot.val();
// })
//
// fireDesc.on('value', function(snapshot){
// 	descriptionPara.innerText = snapshot.val();
// })

function getDatabaseData() {

	for (i=1;i<uniqueId;i++){
		var fireTitle = firebase.database().ref('Markers/' + i).child("title");
		//var fireDesc = firebase.database().ref('Markers/' + i).child("description");
		list = [];
		fireTitle.on('value', function(snapshot){
			console.log(snapshot.val());
		 	//list.push(snapshot.val());
		});
		 list2.push(list);


	}
}

function deleteData1(id) {
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
				latitude: longitude,
				longitude: latitude
		  });
		}






}
