var ge; 
var socket;
var socket2;
var camera;
var last;
var ROLL; var ROLLS = [0,0];
var YAW; var YAWS = [0,0];
var PITCH; var PITCHS = [0,0];
var CURRENT_HEADING;
var CURRENT_PITCH;
var MOVE_LEFT;
var MOVE_RIGHT;
var MOVE_FORWARD;
var MOVE_BACKWARD;
var MOVE_UP;
var MOVE_DOWN;
var MOVE_SPEED;
var MODE; //1 = Surfing Mode (Default), 2 = Follow Mode, 3 = Tablet

//Google Conference
var TOT_FEATS;

var scale;
var queue = new Queue();
var slowdown;
var tailModel;
var tailpm;
var playerid;
var tail;
var count=0;
var slow;
var master;
var rings = new Array();
var ringpms = new Array();
var ringmodels = new Array();
var ringlinks = new Array();
var ringoriens = new Array();
var playermodels = new Array();
var playerpms = new Array();
var playerlinks = new Array();
var playeroriens = new Array();

var localAnchorLla;
var localAnchorCartesian;
var distanceTraveled;
var currentAltitude = 0.0;

var skeledata = {"head":3, 
				 "shoulder":{"center":2, "left":4, "right":8},
				 "spine":1, 
				 "elbow":{"left":5, "right":9},
				 "wrist":{"left":6, "right":10},
				 "hand":{"left":7, "right":11}, 
				 "hip":{"center":0, "left":12, "right":16},
				 "knee":{"left":13, "right":17},
				 "ankle":{"left":14, "right":18}, 
				 "foot":{"left":15, "right":19}};      
				
google.load("earth", "1");  
google.setOnLoadCallback(init);

function debug(message) {
	lbldebug.innerHTML = message;
}

function closeSocket() {
	socket.close();
}

//Code for Google Conference
function addKmlFromUrl(kmlUrl) {
	var link = ge.createLink('');
	link.setHref(kmlUrl);

	var networkLink = ge.createNetworkLink('');
	networkLink.setLink(link);
	//networkLink.setFlyToView(true);

	ge.getFeatures().appendChild(networkLink);
}

function init() {          
	google.earth.createInstance('map3d', initCB, failureCB);  
	document.documentElement.style.overflow = 'hidden';	 
	document.body.scroll = "no";
	
}

function initCB(instance) { 
	//View Variables
	ROLL = 0;
	PITCH = 0;
	YAW = 0;
	CURRENT_HEADING = YAW;
	CURRENT_PITCH = PITCH;
	currentAltitude = 300;
	MODE = 1; //KINECT
	master = false;
	slowdown = 0;
	
	//GE Conference
	TOT_FEATS = 0;
	
	//Movement Variables
	last = (new Date()).getTime();
	localAnchorLla = [-33.87463, 151.20362, currentAltitude];
	localAnchorCartesian = V3.latLonAltToCartesian(localAnchorLla);
	
	//Initialising Google Earth
	ge = instance;
	ge.getWindow().setVisibility(true);  
	ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true); 
	ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT); 	
	
	//Initalising Camera
	camera = ge.createCamera('');
	camera.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
	camera.setLatitude(-33.87463); //Sydney
	camera.setLongitude(151.20362);
	camera.setAltitude(300);
	//console.log(camera.getLatitude() +' '+ camera.getLongitude() +' '+ localAnchorLla[0] +' '+ localAnchorLla[1] +' '+ localAnchorLla[2]);
	/*-----------------
    | WEB SOCKET CODE |
    -----------------*/
	
	// Initialize a new web sockets.
    	socket = new WebSocket("ws://localhost:8181/"); // Kinect WS source
    	//socket = new WebSocket("ws://192.168.0.154:8181/"); // Kinect WS source
	socket2 = new WebSocket("ws://192.168.0.233:3000/relay"); // Models WS source
	
	var qryArgs = getQueryStringVars();
			
	if (qryArgs["player"]) {
		playerid = qryArgs["player"];
	}
	if (qryArgs["master"]) {
		if(qryArgs["master"] == 'true') { master = true; }
	}
	if (qryArgs["mode"]) {
		MODE = qryArgs["mode"];
	}
	if(!master) { ge.getOptions().setMouseNavigationEnabled(false); }
	//console.log("Mode: " + MODE);
	initPlayers();
	initRingArray();
	drawRings();
	initTail(); 
	DuasWS();
}

function getQueryStringVars() {

    var server_variables = {};
    var query_string = window.location.search.split( "?" )[ 1 ];
    if ( ! query_string ) return false;
    var get = query_string.split( "&" );
	
    for ( var i=0; i < get.length; i++ ) {

        var pair = get[ i ].split( "=" );
        server_variables[ pair[ 0 ] ] = unescape( pair[ 1 ] );
    }

    return server_variables;
}

/*------------
| MODEL CODE |
------------*/

function DuasWS() { 
	if(master && MODE == 1) { google.earth.addEventListener(ge, 'frameend', serialize); }
	socket.onmessage = function(evt) { doKinect(evt.data) }; //Kinect - move
	socket2.onmessage = function(evt) { deSerialize(evt.data) }; //Duas - models
}  

function serialize() {
		
	var camS = {};
	
	count++;

	var cameraS = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);

	camS.cou = count;
	camS.id = playerid;
	camS.Lat = cameraS.getLatitude();
	camS.Lon = cameraS.getLongitude();
	camS.Til = cameraS.getTilt();
	camS.Rol = cameraS.getRoll();
	camS.Alt = cameraS.getAltitude();
	camS.Hea = cameraS.getHeading(); 
			
	var JSONcam = JSON.stringify(camS);
		
	socket2.send(JSONcam);
}

function deSerialize(message) {
	if(!checkCommand(message)) {
		var cam = JSON.parse(message);  
		
		if(cam.id != playerid && MODE == 2 && master == true) {	// on rig master follow tablet ws cam stream
			camera.setLatitude(cam.Lat);
			camera.setLongitude(cam.Lon);
			camera.setAltitude(cam.Alt);
			camera.setHeading(cam.Hea);
			camera.setTilt(cam.Til);
			camera.setRoll(cam.Rol);
			
			ge.getView().setAbstractView(camera); 
		} else if(cam.id != playerid && MODE == 1) { // tablet stream used to place model
			var scale = (cam.Alt / 100) * (cam.Alt / 100);
			if (scale < 30) { scale = 30; }
			if (scale > 50000) { scale = 50000; }
			//console.log("scale:"+scale);


			if (cam.id == 1) { // flip XWing (Alf)
				playeroriens[cam.id - 1].setHeading(cam.Hea + 180);
				playeroriens[cam.id - 1].setRoll(cam.Rol + 180);	
				playeroriens[cam.id - 1].setTilt(cam.Til + 90);
			} else { // TIE
				playeroriens[cam.id - 1].setHeading(cam.Hea);
				playeroriens[cam.id - 1].setRoll(cam.Rol + 180);	
				playeroriens[cam.id - 1].setTilt(270 - cam.Til);
			}
			//playeroriens[cam.id - 1].setRoll(cam.Rol + 180);	
			//playeroriens[cam.id - 1].setTilt(cam.Til+90);
		
			playermodels[cam.id - 1].setOrientation(playeroriens[cam.id - 1]);
			playermodels[cam.id - 1].setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
			playermodels[cam.id - 1].getLocation().setLatLngAlt(cam.Lat,cam.Lon,cam.Alt);
			var modscale = ge.createScale('');
			modscale.set(scale, scale, scale);
			playermodels[cam.id - 1].setScale(modscale); 
			playerpms[cam.id - 1].setGeometry(playermodels[cam.id - 1]);
		
			//draw(placemark, model, 500);
			// var tailpm = ge.createPlacemark('');

			if (0) {
				slowdown = slowdown + 1;
				if (slowdown > 20) {
					updateTail(cam.Lat, cam.Lon, cam.Alt);
					drawTail();
					slowdown = 0;
				}	
			}
		}
	}
}

function checkCommand(message) {
	if(message.substring(0, 4) == "cmd ") {
		var command = message.substring(4, message.length);
		if (command == "grid on") {
			gridlines(1);
		} else if (command == "grid off") {
			gridlines(0);
		} else if (command == "sun on") {
			sun(1);
		} else if (command == "sun off") {
			sun(0);
		} else if (command == "layer ROADS on") {
			layer("ROADS", 1);
		} else if (command == "layer ROADS off") {
			layer("ROADS", 0);
		} else if (command == "layer TREES on") {
			layer("TREES", 1);
		} else if (command == "layer TREES off") {
			layer("TREES", 0);
		} else if (command == "layer BORDERS on") {
			layer("BORDERS", 1);
		} else if (command == "layer BORDERS off") {
			layer("BORDERS", 0);
		} else if (command == "layer BUILDINGS on") {
			layer("BUILDINGS", 1);
		} else if (command == "layer BUILDINGS off") {
			layer("BUILDINGS", 0);
		} else if (command == "refresh") {
			location.reload(true);
		} else if (command == "follow") {
			MODE = 2;
		} else if (command == "surf") {
			localAnchorLla = [camera.getLatitude(), camera.getLongitude(), camera.getAltitude()];
			currentAltitude = camera.getAltitude();
			localAnchorCartesian = V3.latLonAltToCartesian(localAnchorLla);
			MODE = 1;
		} else if(command == "util1") {
			//utilities1
			var i;
			for(i = 0; i < TOT_FEATS; i++) {
				ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
			}
			TOT_FEATS = 1;
			
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities1/kml/powerNetwork.kmz');
			//remove features
			
		} else if(command == "resource1") {
			var i;
			for(i = 0; i < TOT_FEATS; i++) {
				ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
			}
			TOT_FEATS = 4;
			//resource1
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/GasOil.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/AOI.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/dashedLine.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/resource1/models/newRoutes.kmz');
			
		} else if(command == "util2") {
			//utilities2
			var i;
			for(i = 0; i < TOT_FEATS; i++) {
				ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
			}
			TOT_FEATS = 4;
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/sewage.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/water.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/transmission.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/utilities2/kml/UtilityFacilities.kmz');
			
		} else if(command == "gov1") {
			//goverment 1
			var i;
			for(i = 0; i < TOT_FEATS; i++) {
				ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
			}
			TOT_FEATS = 9;
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1p.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1ed.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge1wd.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2p.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2ed.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/bridge2wd.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government1/models/fish.kmz');
			
		} else if(command == "gov2") {
			//government 2
			var i;
			for(i = 0; i < TOT_FEATS; i++) {
				ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
			}
			TOT_FEATS = 5;
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/faultline.kml');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/evac.kml');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/280m.kml');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/hydrants.kml');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/government2/models/staging.kml');
			
		} else if(command == "telco2") {
			// telco2
			var i;
			for(i = 0; i < TOT_FEATS; i++) {
				ge.getFeatures().removeChild(ge.getFeatures().getLastChild());
			}
			TOT_FEATS = 2;
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/telco2/kml/DemoTelcoTowers.kmz');
			addKmlFromUrl('http://px1105.scm.uws.edu.au/discovermapsforbusiness.com/demos/telco2/kml/DemoTelcoCoverages-incident.kmz');
			
		}
		
		return true;
	} else {
		return false;
	}
}

function sun(flag) {
	if (flag == "1") { 
		//doSend("sun on");
		ge.getSun().setVisibility(true);
	} else {
		//doSend("sun off");
		ge.getSun().setVisibility(false);
	}
}

function gridlines(flag) {
	if (flag == "1") {
		//doSend("grid on");
		ge.getOptions().setGridVisibility(true);
	} else {
		//doSend("grid off");
		ge.getOptions().setGridVisibility(false);
	}
}

function layer(layer, flag) {
	if (flag == 1) {
		flag = true;
	} else {
		flag = false;
	}
	
	if (layer == "ROADS")  {
		ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, flag);
	} else if (layer == "TREES") {
		ge.getLayerRoot().enableLayerById(ge.LAYER_TREES, flag);
	} else if (layer == "BORDERS") {
		ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, flag);
	} else if (layer == "BUILDINGS") {
		ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, flag);
	}
}

function updateTail(lat, lon, alt) {
	var point = ge.createPoint('');
	point = queue.dequeue();
	point.setLatitude(lat);
	point.setLongitude(lon);
	point.setAltitude(alt);
	queue.enqueue(point);
}

function drawTail() {
	
	var tail = ge.createLineString('');
	tailpm.setGeometry(tail);
	
	tail.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
	tail.setExtrude(false);
	tail.setTessellate(false);
	
	
	var	i;
	var point;
	for(i = 0; i < 20; i++) {
		point = queue.dequeue();
		tail.getCoordinates().pushLatLngAlt(point.getLatitude(), point.getLongitude(), point.getAltitude());
		queue.enqueue(point);
	}
	tailpm.setStyleSelector(ge.createStyle(''));
	var tailStyle = tailpm.getStyleSelector().getLineStyle();
	tailStyle.setWidth(10);
	if(playerid == 1) {
		tailStyle.getColor().set('FF0000FF');
	} else {
		tailStyle.getColor().set('FFFF0000');
	}
	ge.getFeatures().appendChild(tailpm);
}

function initTail() {
	//Initialises a queue to store models used  to generate the "tail" effect
	//These models will be popped off, generated at a new location, then pushed
	//back onto the queue to be rendered one at a time, maintaining a "trail" state
	var i;
	//var tail;
	var link;
		
	tailpm = ge.createPlacemark('');
	//tailpm.setId("tailpm");
	//tail = ge.createLineString('');
		
	for (i=0;i<15;i++){
		/*var tail = ge.createPlacemark('');
		tailModel = ge.createModel('');
		ge.getFeatures().appendChild(tail);
		link = ge.createLink('');
		link.setHref('http://localhost/tail.dae');
		tailModel.setLink(link);
		tailModel.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);	
		tail.setGeometry(tailModel);
		tail.setName(i.toString()); 
		queue.enqueue(tail);*/
		var point = ge.createPoint('');
		point.setLatitude(0);
		point.setLongitude(0);
		point.setAltitude(100);
		queue.enqueue(point);
	}
	

}
		
function initRingArray() {
	//Initialises the array storing all of the ring locations; these points are hardcoded locations
		
	//var ring = ge.createCamera('');
	
	//Bridge
	rings[0] = ge.createCamera('');
	rings[0].setLatitude(-33.85206116546625);
	rings[0].setLongitude(151.21075014076803);
	rings[0].setAltitude(400);
	rings[0].setHeading(295);
	rings[0].setTilt(0);
	rings[0].setRoll(0);
		
	//Centerpoint Tower
	rings[1] = ge.createCamera('');
	rings[1].setLatitude(-33.87051713231955);
	rings[1].setLongitude(151.2089196340125);
	rings[1].setAltitude(500);
	rings[1].setHeading(20);
	rings[1].setTilt(0);
	rings[1].setRoll(0);
		
	//Opera House
	rings[2] = ge.createCamera('');
	rings[2].setLatitude(-33.85647746674686);
	rings[2].setLongitude(151.21539736966128);
	rings[2].setAltitude(350);
	rings[2].setHeading(345);
	rings[2].setTilt(0);
	rings[2].setRoll(0);
		
		//Island
		rings[3] = ge.createCamera('');
		rings[3].setLatitude(-33.85277242888568);
		rings[3].setLongitude(151.19518041484696);
		rings[3].setAltitude(500);
		rings[3].setHeading(100);
		rings[3].setTilt(0);
		rings[3].setRoll(0);
		 
		//Island 2
		rings[4] = ge.createCamera('');
		rings[4].setLatitude(-33.847886442832646);
		rings[4].setLongitude(151.17302947077044);
		rings[4].setAltitude(450);
		rings[4].setHeading(-80);
		rings[4].setTilt(0);
		rings[4].setRoll(0);
		
		//Intersection
		rings[5] = ge.createCamera('');
		rings[5].setLatitude(-33.83899738245863);
		rings[5].setLongitude(151.14492521934753);
		rings[5].setAltitude(425);
		rings[5].setHeading(-100);
		rings[5].setTilt(0);
		rings[5].setRoll(0);
		
		//Sticky Outy Bit
		rings[6] = ge.createCamera('');
		rings[6].setLatitude(-33.85295290380713);
		rings[6].setLongitude(151.11663584044823);
		rings[6].setAltitude(475);
		rings[6].setHeading(5);
		rings[6].setTilt(0);
		rings[6].setRoll(0);
		
		//Park
		rings[7] = ge.createCamera('');
		rings[7].setLatitude(-33.87265406702083);
		rings[7].setLongitude(151.11497495616567);
		rings[7].setAltitude(450);
		rings[7].setHeading(155);
		rings[7].setTilt(0);
		rings[7].setRoll(0);
		
		//Park
		rings[8] = ge.createCamera('');
		rings[8].setLatitude(-33.88634599261195);
		rings[8].setLongitude(151.13468354866743);
		rings[8].setAltitude(475);
		rings[8].setHeading(100);
		rings[8].setTilt(0);
		rings[8].setRoll(0);
		
		//Road
		rings[9] = ge.createCamera('');
		rings[9].setLatitude(-33.887918557061845);
		rings[9].setLongitude(151.16950205667513);
		rings[9].setAltitude(490);
		rings[9].setHeading(85);
		rings[9].setTilt(0);
		rings[9].setRoll(0);
		
		//Finish
		rings[10] = ge.createCamera('');
		rings[10].setLatitude(-33.8844656522078);
		rings[10].setLongitude(151.20894468812577);
		rings[10].setAltitude(490);
		rings[10].setHeading(85);
		rings[10].setTilt(0);
		rings[10].setRoll(0);
		
					//Finish (Imperial Star Destroyer)
	rings[11] = ge.createCamera('');
	rings[11].setLatitude(-33.85543128617356);
	rings[11].setLongitude(151.21241027523143);
	rings[11].setAltitude(7999.903289511771);
	rings[11].setHeading(85);
	rings[11].setTilt(0);
	rings[11].setRoll(0);
	
}

function drawRings() {
	//Draw all of the rings in the array			
			
	var i;
			
	for(i = 0; i <= 10; i++) { // 11 includes star destroyer
		ringmodels[i] = ge.createModel('');
		ringlinks[i] = ge.createLink('');
		if(i == 1) {
				
			ringlinks[i].setHref('http://192.168.0.233/bluering.dae');
		} else if(i == 10) {
			ringlinks[i].setHref('http://192.168.0.233/greenring.dae');
		} else if(i == 11){ 
			ringlinks[i].setHref('http://192.168.0.233/Imperial.dae');
		} else {
			ringlinks[i].setHref('http://192.168.0.233/redring.dae');
		} 
		ringoriens[i] = ge.createOrientation('');
		ringpms[i] = ge.createPlacemark('');
		ringpms[i].setName('ring' + i);
		ge.getFeatures().appendChild(ringpms[i]);
		ringoriens[i].setHeading(rings[i].getHeading());
		ringoriens[i].setTilt(rings[i].getTilt());
		ringoriens[i].setRoll(rings[i].getRoll());
		var ringscale = ge.createScale('');
		if (i == 11){
			ringscale.set(50, 50, 50);}
		else{
			ringscale.set(10, 10, 10);}
		ringmodels[i].setScale(ringscale);
		ringmodels[i].setOrientation(ringoriens[i]);
		ringmodels[i].setLink(ringlinks[i]);
		ringmodels[i].setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);	
		ringmodels[i].getLocation().setLatLngAlt(rings[i].getLatitude(),rings[i].getLongitude(),rings[i].getAltitude());				
		ringpms[i].setGeometry(ringmodels[i]);
	}
}
	
function initPlayers() {
	//Initialises all of the player data
	var i;
	for(i = 0; i < 3; i++) {
		playermodels[i] = ge.createModel('');
		playerlinks[i] = ge.createLink('');
		playeroriens[i] = ge.createOrientation('');
		if(i == 0) {
			playerlinks[i].setHref('http://192.168.0.233/xwing.dae');
			playerlinks[i].setHref('http://192.168.0.233/xwing.dae');
		} else {
			playerlinks[i].setHref('http://192.168.0.233/models/beachball.dae'); // tie.dae or models/beachball.dae
		}
		playerpms[i] = ge.createPlacemark('');
		playerpms[i].setName('player' + i);
		ge.getFeatures().appendChild(playerpms[i]);
		playermodels[i].setLink(playerlinks[i]);
		playermodels[i].setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);				
		playerpms[i].setGeometry(playermodels[i]);
	}
}

/*----------------
| END MODEL CODE |
----------------*/

/*------------\
| KINECT CODE |
\------------*/

function doKinect(evt) {
	if(MODE == 1) {
		status.innerHTML = "Kinect data received.";
		// Get the data in JSON format.
		var jsonObject = eval('(' + evt + ')');

		// Display the skeleton joints.		
		var shoulderleft = jsonObject.skeletons[0].joints[skeledata.shoulder.left];
		var shoulderright = jsonObject.skeletons[0].joints[skeledata.shoulder.right];
		var shouldercenter = jsonObject.skeletons[0].joints[skeledata.shoulder.center];
		var hip = jsonObject.skeletons[0].joints[skeledata.hip.center];
		var hipleft = jsonObject.skeletons[0].joints[skeledata.hip.left];
		var hipright = jsonObject.skeletons[0].joints[skeledata.hip.right];
		var wristright = jsonObject.skeletons[0].joints[skeledata.wrist.right];
		var wristleft = jsonObject.skeletons[0].joints[skeledata.wrist.left];
		var spine = jsonObject.skeletons[0].joints[skeledata.spine];
		var kneeright = jsonObject.skeletons[0].joints[skeledata.knee.right];
		var kneeleft = jsonObject.skeletons[0].joints[skeledata.knee.left];
		var ankleright = jsonObject.skeletons[0].joints[skeledata.ankle.right];
		var ankleleft = jsonObject.skeletons[0].joints[skeledata.ankle.left];
		
		// Alf - basic sanity checks, does this skeleton make sense?
		
		//console.log("shoulder:"+shouldercenter.y+" hipc:"+hip.y+" hipl:"+hipleft.x+" hipr:"+hipright.x);
		//console.log("shoulder:"+shouldercenter.y+" spine:"+spine.y);

		// shoulder above hip, hip left and right of each other, shoulder above spine and has y-delta

		if ((shouldercenter.y < hip.y) && (hipleft.x < hipright.x) && ((spine.y - shouldercenter.y > 50))) {
		
		PITCH = (shoulderleft.y - shoulderright.y);
	
		//ROLL = (hip.z - spine.z) *200 +12 ;
		ROLL = ((hip.z - shouldercenter.z) * 150) + 10;
		
		//console.log("hip:"+hip.z +" spine:"+spine.z + " ROLL:"+ROLL);
		
		YAW = shoulderright.z - shoulderleft.z; 
		
		// Alf centering "springs" using cubic and squares applied to offsets.	
		var newROLL = ROLL;
		if (ROLL > 0) { // forward roll/bend
			//newROLL = (ROLL * ROLL) / 9;
		} else { // back roll/bend
			newROLL = ROLL * 2;
		}
		//console.log("ROLL:"+ROLL+ " new:"+newROLL);
		ROLL = newROLL;	
					
		//console.log("roll:" + ROLL + " pitch:" + PITCH + " yaw:" + YAW);
		MOVE_LEFT = false;
		MOVE_RIGHT = false;
		MOVE_FORWARD = true;
		MOVE_BACKWARD = false;
		MOVE_UP = false;
		MOVE_DOWN = false;
		MOVE_SPEED = 0.0;
		
		//console.log("wristr:"+wristright.x+" shoulderr:"+shoulderright.x);

		if (wristright.y > hip.y && wristleft.y > hip.y) { // both wrists below hips is a STOP
		// WE ARE STOPPED
			MOVE_BACKWARD = true; // same as stopped
		
			if (0) { // off or on
			if (YAW > 0) { // turns left/right square spring
				YAW = (YAW * YAW) * 5; // turning right (open to rig)
			} else {
				YAW = - (YAW * YAW) * 15; // turning left (away from rig)
			}
		
			if (PITCH > 0) { // pitch springs
				PITCH = (PITCH * PITCH * PITCH ) / 500; // look up 
			} else {
				PITCH = - (PITCH * PITCH) / 25; // look down
			}
		
			var lastPITCH = PITCHS[PITCHS.length - 1];

			var limit = Math.abs(lastPITCH) / 2.5 + 4; // PITCH limit gets bigger at extremes
			//console.log("PITCH="+PITCH+" last:"+ lastPITCH + " limit:"+limit);
			//console.log("PITCH="+PITCH+" limit:"+limit + " diff:" +Math.abs(PITCH - lastPITCH) );

			if (Math.abs(PITCH - lastPITCH) > limit) { // PITCH big diff use last value
				console.log("BIG PITCH");
				PITCH = lastPITCH;
			}
			} // off or on
		
		} else { // we are moving
			//var altSpeedup = camera.getAltitude() /1000;
			var altSpeedup = camera.getAltitude() / 1100;

			if (altSpeedup < 1) { altSpeedup = 1; }

			var wristDelta = wristright.x - shoulderright.x; // 5 is so wrist can be elbow length with stop
			
			if (wristDelta < 0) {
				MOVE_SPEED = 0;
			} else {
				wristDelta /= 3; // pre-scale wrist axis
				MOVE_SPEED = ((wristDelta * wristDelta) / 3) * altSpeedup;
			}
			//console.log("MOVE_SPEED:"+MOVE_SPEED);
		}
		
		var now = (new Date()).getTime();
		var dt = (now - last) / 1000.0;
		if(dt > 0.25) {
			dt = 0.25;
		}
		last = now;
		
		// Alf push current Y,P,R onto save stack and shift out old value to maintain length
		if (0) { // off or on
		YAWS.push(YAW);	YAWS.shift();
		PITCHS.push(PITCH); PITCHS.shift();
		ROLLS.push(ROLL); ROLLS.shift();
		
		// Alf get average for Y,P,R from save stack
		var i; var j = 0;
		//console.log("len:"+ YAWS.length);
		for (i=0; i<YAWS.length; i++) {	j += YAWS[i];	} // average last X yaws
		YAW = j / YAWS.length;
		j = 0;
		for (i=0; i<PITCHS.length; i++) { j += PITCHS[i]; } // average last X pitchs
		PITCH = j / PITCHS.length;
		j = 0;
		for (i=0; i<ROLLS.length; i++) { j += ROLLS[i]; } // average last x rolls
		ROLL = j / ROLLS.length;
		//console.log("avg yy:"+ yy);
		} // off or on
		
		updatePosition(dt);
		updateView();
		updateCamera();
		}; // Alf sanity checks
	}			
}	

function failureCB(errorCode) {  
		//socket.send(errorCode);
} 

function updateCamera() {
		camera.setLatitude(localAnchorLla[0]);
		camera.setLongitude(localAnchorLla[1]);
		ge.getView().setAbstractView(camera); 
}

function updateView() {
		//The orentation of the player - look left/look right/look up/look down controls
		//var newtilt = (((PITCH + CURRENT_PITCH) *3) + 90) % 360;
		//if(newtilt > 120) { newtilt = 120; }
		//camera.setTilt(newtilt);
		camera.setTilt( PITCH +90 );
		camera.setRoll( ROLL );
		camera.setHeading( ((YAW + CURRENT_HEADING)*6) % 360 );
		//console.log("ca:"+currentAltitude);
		camera.setAltitude( currentAltitude );
		
		//debug("Tilt: " + (camera.getTilt() - 90) + " Roll: " + camera.getRoll() + " Heading: " + camera.getHeading() + " Altitude: " + camera.getAltitude());

		//Increment the heading and tilt
		CURRENT_HEADING += YAW;
		//CURRENT_PITCH += PITCH;
		//if(CURRENT_PITCH > 120) { CURRENT_PITCH = 120; }
}

function updatePosition(dt) {
		//The movement of the player, forward/backward/up/down controls	
		var localToGlobalFrame = M33.makeLocalToGlobalFrame(localAnchorLla);
		
		var headingVec = V3.rotate(localToGlobalFrame[1], localToGlobalFrame[2], -(camera.getHeading() * Math.PI / 180));
		var rightVec = V3.rotate(localToGlobalFrame[0], localToGlobalFrame[2], -(camera.getHeading() * Math.PI / 180));
		
		var strafe = 0.0;
		strafe = ROLL * dt * -1;
			
		var forward = 0;
		if (MOVE_FORWARD) {
			//var forwardVelocity = 100;
			var forwardVelocity = MOVE_SPEED;
			if (MOVE_BACKWARD) forwardVelocity *= -1;
			forward = forwardVelocity * dt;
		}
		
		if(MOVE_BACKWARD) {
			forward = 0;
		}
		
		var tilt = camera.getTilt();
		tilt++; // Alf workaround for starting at 0 tilt, math errors
		
		//Altitude Control... ALGEBRA IS COOL MKAY
		
		var altOffset = 0;
		
		if (tilt < 90) {
			tilt = 90 - tilt;
			altOffset = - forward * Math.tan(tilt * Math.PI / 180);			
		} else if (tilt > 90) {
			tilt = tilt - 90;
			altOffset  = forward * Math.tan(tilt * Math.PI / 180);
		}
		
		//console.log('Alt:' + currentAltitude + ' tilt:' + tilt + ' forward:' + forward + ' offset:' + altOffset);
		currentAltitude += altOffset;
		//console.log('Alt2:' + currentAltitude);
		
		//debug((((forward) * (Math.tan(tilt))) / 100));
		
		localAnchorCartesian = V3.add(localAnchorCartesian, V3.scale(rightVec, strafe));
		localAnchorCartesian = V3.add(localAnchorCartesian, V3.scale(headingVec, forward));
		
		localAnchorLla = V3.cartesianToLatLonAlt(localAnchorCartesian);
		//debug("Roll: " + localAnchorLla[0]);
}

/*-----------------
| END KINECT CODE |
-----------------*/
