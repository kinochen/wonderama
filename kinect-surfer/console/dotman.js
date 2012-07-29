window.onload = function () {

	var logWindow = document.getElementById("logwindow");
	var canvas = document.getElementById("dotman_canvas");
	var context = canvas.getContext("2d");
	var scaleX = canvas.width / 640; // Alf
	var scaleY = canvas.height / 480; // Alf
	var logCount = 0;

	if (!window.WebSocket) {
		logWindow.innerHTML = "Your browser does not support web sockets!";
		return;
	}

	altWindow = document.getElementById("altwindow");
	headingWindow = document.getElementById("headingwindow");
	speedWindow = document.getElementById("speedwindow");
	bandwidthWindow = document.getElementById("bandwidthwindow");

    logWindow.innerHTML = "<strong>Connecting to kinect websocket relay...</strong>";

    // Initialize a new web socket.
    var kinectSocket = new WebSocket("ws://192.168.0.58:8181/KinectHtml5");
    //var kinectSocket = new WebSocket("ws://192.168.0.154:8181/KinectHtml5");
    var relaySocket = new WebSocket("ws://192.168.0.233:3000/relay");
    //var socket = new WebSocket("ws://localhost:3000/relay");

    // Connection established.
    kinectSocket.onopen = function () {
        logWindow.innerHTML = "<strong>kinectSocket Connection established</strong>";
    };
    relaySocket.onopen = function () {
        logWindow.innerHTML = "<strong>relaySocket Connection established</strong>";
    };

    // Connection closed.
    kinectSocket.onclose = function () {
        logWindow.innerHTML = "<strong>kinectSocket Connection closed</strong>";
    }
    relaySocket.onclose = function () {
        logWindow.innerHTML = "<strong>relaySocket Connection closed</strong>";
    }

    // Receive data FROM the server!
    kinectSocket.onmessage = function (evt) {

        // Get the data in JSON format.
        var jsonObject = eval('(' + evt.data + ')');

	// Show every n'th websocket string
	if (logCount > 10) {
		logWindow.innerHTML = "<strong>Kinect WebSocket stream:</strong> " + evt.data.substring(0,360);
		//console.log( evt.data );
		logCount = 0;
	} else { 
		logCount++;
	}

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#ffffff";
       	context.beginPath();

	var wristL = 0; var wristR = 0; var hipL = 0; var hipR = 0; var hipC = 0;

        // Display the skeleton joints.
        for (var i = 0; i < jsonObject.skeletons.length; i++) {
		if (i == 0) { context.fillStyle = "#fff"; }
		if (i == 1) { context.fillStyle = "#ff0"; }

            for (var j = 0; j < jsonObject.skeletons[i].joints.length; j++) {
                var joint = jsonObject.skeletons[i].joints[j];

		if (j == 6) {
			wristL = parseFloat(joint.y); // record and skip
		} else if (j == 10) {
			wristR = parseFloat(joint.y); // record and skip
		} else {
			if (j == 0) { hipC = parseFloat(joint.y); } // record hipC
			//if (j == 12) { hipL = parseFloat(joint.y); } // record hipL
			//if (j == 16) { hipR = parseFloat(joint.y); } // record hipR

                	context.arc(parseFloat(joint.x)*scaleX, parseFloat(joint.y)*scaleY, 40-parseFloat(joint.z)*10, 0, Math.PI * 2, true);
		}
		}
        }
		context.closePath;
		context.fill();

	//console.log("hip:" + hipL + " wristL:"+ wristL);
	if ((wristL > hipC) && (wristR > hipC)) {  // red wrist if wrists below hip
		context.fillStyle="red";
	} else { 
        	context.fillStyle = "white";
	}
       	context.beginPath();
        // Display the skeleton wrists.
        for (var i = 0; i < jsonObject.skeletons.length; i++) {
            for (var j = 0; j < jsonObject.skeletons[i].joints.length; j++) {
                var joint = jsonObject.skeletons[i].joints[j];

		if (j == 6 || j == 10) {
                	context.arc(parseFloat(joint.x)*scaleX, parseFloat(joint.y)*scaleY, 40-parseFloat(joint.z)*10, 0, Math.PI * 2, true);
		}
		}
        }
		context.closePath;
		context.fill();

	// Display the skeleton lines.
        //context.lineWidth = 4;
        //context.strokeStyle = "red";

        for (var i = 0; i < jsonObject.skeletons.length; i++) { // for each skel set
		// shoulders left 4 right 8
                jointLine(jsonObject.skeletons[i].joints[4], jsonObject.skeletons[i].joints[8], 1.5, 85, "h");
		// should center + hip
                jointLine(jsonObject.skeletons[i].joints[1], jsonObject.skeletons[i].joints[2], 0.5, 120, "v" );
		// hips left 12 right 16
                //jointLine(jsonObject.skeletons[i].joints[12], jsonObject.skeletons[i].joints[16], 4, 180 );
		// shoulder - wrist
                //jointLine(jsonObject.skeletons[i].joints[8], jsonObject.skeletons[i].joints[10], 0, 10 );
        }


        // Inform the server about the update.
        //socket.send("Skeleton drawn: " + (new Date()).toTimeString());
    };

function jointLine( j1, j2, scaleL, scaleH, dir ) {

        var x1 = parseFloat(j1.x)*scaleX; var y1 = parseFloat(j1.y)*scaleY;
        var x2 = parseFloat(j2.x)*scaleX; var y2 = parseFloat(j2.y)*scaleY;
	var z1 = parseFloat(j1.z); var z2 = parseFloat(j2.z);
        var diffX = (x2 - x1) * scaleL;
        var diffY = (y2 - y1) * scaleL;
	var diffZ = Math.round((z2 - z1) * scaleH);
	//console.log("diffZ:" + diffZ);

        x1 -= diffX; y1 -=diffY;
        x2 += diffX; y2 +=diffY;
	var leftZ =0; var rightZ = 0;

	if (diffZ > 0) { leftZ = diffZ; } else { rightZ =  -diffZ; }

	if (Math.abs(diffZ) < 3) {
        	context.fillStyle = "#f80"; // dark yellow
	} else {
        	context.fillStyle = "red";
	}

	var girth = 3; // minimum bar thickness
	context.beginPath();
	if (dir == "h") { // horizontal line
        context.moveTo(x1, y1-leftZ-girth);
        context.lineTo(x2, y2-rightZ-girth);
        context.lineTo(x2+rightZ*1.5, y2); // point
        context.lineTo(x2, y2+rightZ+girth);
        context.lineTo(x1, y1+leftZ+girth);
        context.lineTo(x1-leftZ*1.5, y1); // point
	} else { //vertical
        context.moveTo(x1-leftZ-girth, y1);
        context.lineTo(x1, y1+leftZ); // point
        context.lineTo(x1+leftZ+girth, y1);
        context.lineTo(x2+rightZ+girth, y2);
        context.lineTo(x2, y2-rightZ); // point
        context.lineTo(x2-rightZ-girth, y2);
	}
        context.closePath();
        //context.stroke(); // draws line
        context.fill();
};

	// when a relaySocket message arrives
	relaySocket.onmessage = function (evt) {

		var message = evt.data;
		//logWindow.innerHTML = message;
		//console.log(message);

		if (message.substring(0,3) == "cmd ") {
			// looks like a command
			logWindow.innerHTML = message;
			if (message == "cmd refresh") {
				location.reload(true);
			}
		} else {
			// looks like something else... hopefully cam data!
			var cam = JSON.parse(message);
			if (cam.id == 2) {
				ballLat = cam.Lat;
				ballLon = cam.Lon;
			}
		}
	}

};
