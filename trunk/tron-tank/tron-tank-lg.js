/* modifications for WebSocket proof of concept for immersive vis rigs such as Liquid Galaxy
 * 
 * Andrew Leahy
 * alfski@gmail.com
*/
/* SceneJS COLLADA import example - the Tank Program from the 1982 Disney motion picture "Tron".
 *
 * This demo is a revamp of the old one for V0.7.6, using new capabilities of V0.7.8:
 *
 * Take it for a drive - mouse wheel controls speed, left/right drag to steer, up/down drag to change viewpoint height.
 *
 * Tank model is courtesy of Abraham Katase, provided in the Google 3D Warehouse at http://tinyurl.com/y8oknya
 *
 * Lindsay S. Kay,
 * lindsay.kay@xeolabs.com
 */

SceneJS.createNode({
    type: "scene",
    id: "theScene",
    canvasId: 'theCanvas',
    loggingElementId: "theLoggingDiv",

    nodes: [
        /**
         * View transform - we've given it a globally-unique ID
         * so we can look it up and update it's properties from
         * mouse input.
         */
        {
            type: "lookAt",
            id: "theLookAt",
            eye : { x: 0, y: 10, z: -400 },
            look :  { x: 0, y: 0, z: 0 },
            up : { x: 0, y: 1, z: .0 },

            nodes: [
                {
                    type: "camera",
                    optics: {
                        type: "perspective",
                        fovy : 30.0,
                        aspect : 9 / 16, // Alf portrait LG screens are 9:16 vs 16:9
                        near : 0.10,
                        far : 7000.0
                    },

                    nodes: [
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 0.5 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 0.0, y: -1, z: -1.0 }
                        },
                        {
                            type:"light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: -.5, z: -1.0  }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: -1.0, y: -.5, z: 1.0  }
                        },


                        /* Integrate our JSON Tron Tank model, which is defined in tron-tank-model.js
                         * and loaded via a <script> tag in index.html.
                         *
                         * Various nodes (ie. rotate and translate) within the model have been assigned IDs,
                         * allowing us to locate them and set their properties, in order to move the tank
                         * around, rotate its cannon etc.
                         */
                        tankJSON,

                        /* Integrate our grid floor, which is defined in grid-floor.js
                         * and loaded via a <script> tag in index.html.
                         */
                        gridFloorJSON,

                        /* Canyon walls, a bunch of cubes
                         */
                        {
                            type:"material",
                            baseColor:      { r: 0.3, g: 0.3, b: 0.3 },
                            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                            specular:       10.9,
                            shine:          20.0,
                            alpha: 0.5,
                            flags: {
                                transparent: true
                            },

                            nodes: [

                                {
                                    type: "translate",
                                    x: -75,
                                    y: 0,
                                    z: 0,

                                    nodes: [

                                        {
                                            type: "rotate",
                                            y: 1,
                                            angle: 6,
                                            nodes: [
                                                {
                                                    type: "cube",
                                                    xSize: 50,
                                                    ySize: 30,
                                                    zSize: 50
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "translate",
                                    x: 80,
                                    y: 0,
                                    z: 0,

                                    nodes: [
                                        {
                                            type: "rotate",
                                            y: 1,
                                            angle: 0,

                                            nodes: [
                                                {
                                                    type: "cube",
                                                    xSize: 50,
                                                    ySize: 30,
                                                    zSize: 50
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "translate",
                                    x: -80,
                                    y: 0,
                                    z: 80,

                                    nodes: [
                                        {
                                            type : "rotate",
                                            y: 1,
                                            angle: -12 ,
                                            nodes: [
                                                {
                                                    type: "cube",
                                                    xSize: 50,
                                                    ySize: 30,
                                                    zSize: 50
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "rotate",
                                    x: 80,
                                    y: 0,
                                    z: 40,

                                    node:[
                                        {
                                            type: "rotate",
                                            y: 1,
                                            angle: -12,
                                            nodes: [
                                                {
                                                    type: "cube",
                                                    xSize: 50,
                                                    ySize: 30,
                                                    zSize: 50
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "translate",
                                    x: 120,
                                    y: 0,
                                    z: 140,

                                    nodes: [
                                        {
                                            type: "rotate",
                                            y: 1,
                                            angle: -12 ,

                                            nodes: [
                                                {
                                                    type: "cube",
                                                    xSize: 50,
                                                    ySize: 30,
                                                    zSize: 50
                                                }
                                            ]
                                        }
                                    ]
                                },

                                {
                                    type: "translate",
                                    x: -60,
                                    y: 0,
                                    z: 160,

                                    nodes: [
                                        {
                                            type: "rotate",
                                            y: 1,
                                            angle: -12,

                                            nodes: [
                                                {
                                                    type: "cube",
                                                    xSize: 50,
                                                    ySize: 30,
                                                    zSize: 50
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});


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


/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/

var needFrame = true;
var slaveFrame = false;
var speed = 0;
var tankPos = { x: 0, y: 0, z: -100 };
var lookPos = { x: 0, y: 10, z: -400 };
var eye = { x: 0, y: 10, z: -400 };

var trailVec = { x:0, y: 0, z: 0 };
var lookVec = { x:0, y: 0, z: 0 };

var lastX;
var lastY;
var dragging = false;

var tankYaw = 0;
var tankYawInc = 0;

var trailYaw = 0;
var trailYawInc = 0;

var pitch = 25;
var pitchInc = 0;

/* Always get canvas from scene - it will try to bind to a default canvas
 * can't find the one specified */
var canvas = document.getElementById("theCanvas");

// Alf start LG setup
canvas.width = document.width -16;
canvas.height = document.height -16;

var MASTER = 0;
var rotYMult = 0;  // this is -3, -2, -1, 0, 1, 2, 3, 4 for the various LG monitors.
var args = getQueryStringVars();

if (args["rot"]) { rotYMult = args["rot"] }
if (args["master"]) { MASTER = 1 }

var fovMult = 1.95;  // this value fits my LG. Adjust to account for gap between monitors.
var fov = 21.0; // should probably be 60 for LG?
var fovy = fov * Math.PI / 180;
var fovx = Math.atan( Math.tan(fovy * 0.5) * canvas.width / canvas.height) * 2;
var rot3x3 = Matrix.RotationY(rotYMult * fovx * -fovMult);
var rotMat = $M([
          [rot3x3.elements[0][0], rot3x3.elements[0][1], rot3x3.elements[0][2], 0],
          [rot3x3.elements[1][0], rot3x3.elements[1][1], rot3x3.elements[1][2], 0],
          [rot3x3.elements[2][0], rot3x3.elements[2][1], rot3x3.elements[2][2], 0],
          [0, 0, 0, 1]
]);

var thisMesg = ""; var lastMesg = "";
var oldEye = { x:0, y:0, z:0 };

var ws = new WebSocket("ws://137.154.151.126:3000");
ws.onopen = function() {
        ws.send("starting");
};

ws.onclose = function() { };

if (!MASTER) { // onle the SLAVES receive
	ws.onmessage = function(e) {
                var message = new Array();
                message  = e.data.split(",");
                tankYaw = message[0];
                eye.x = message[1]; 
                eye.y = message[2];
                eye.z = message[3];
                tankPos.x = message[4];
                tankPos.y = message[5];
                tankPos.z = message[6];
		slaveFrame = true;
        }
}     

// Alf end LG var setup

if (MASTER) { // Alf only do mouse things on Master

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
    tankYawInc = 0;
    pitchInc = 0;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (dragging) {
        tankYawInc = (event.clientX - lastX) * -0.01;
        pitchInc = (lastY - event.clientY) * 0.001;
    }
} 

function mouseWheel(event) {
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
        if (window.opera) delta = -delta;
    } else if (event.detail) {
        delta = -event.detail / 3;
    }
    if (delta) {
        if (delta < 0) {
            speed -= 0.2;
        } else {
            speed += 0.2;
        }
    }
    if (event.preventDefault)
        event.preventDefault();
    event.returnValue = false;
}

 canvas.addEventListener('mousedown', mouseDown, true);
 canvas.addEventListener('mousemove', mouseMove, true);
 canvas.addEventListener('mouseup', mouseUp, true);
 canvas.addEventListener('mousewheel', mouseWheel, true);
 canvas.addEventListener('DOMMouseScroll', mouseWheel, true);
}

SceneJS.bind("error", function(e) {
    alert(e.exception.message);
});

// fn from gregg
function cameraLookAt(eye, target, up) {
          eye = $V([eye.x, eye.y, eye.z]);
          target = $V([target.x, target.y, target.z]);
          up = up ? $V([up.x, up.y, up.z]) : $V([0, 1, 0]);

          var vz = eye.subtract(target).toUnitVector();
          var vx = up.cross(vz).toUnitVector();
          var vy = vz.cross(vx);

          return $M([
            [vx.elements[0], vx.elements[1], vx.elements[2], 0],
            [vy.elements[0], vy.elements[1], vy.elements[2], 0],
            [vz.elements[0], vz.elements[1], vz.elements[2], 0],
            [eye.elements[0], eye.elements[1], eye.elements[2], 1]
          ]);
}

// main loop

SceneJS.withNode("theScene").start({
    idleFunc: function() {


if (MASTER) { // Alf scene things only concerning Master view
         if (!needFrame && ( pitchInc == 0 && tankYawInc == 0 && speed == 0 && trailYaw == 0)) {
            return; // no change so let's bail
        }
        needFrame = false;
        
        pitch += pitchInc;

        if (pitch < 2) { pitch = 2; }
        if (pitch > 90) { pitch = 90; }

        tankYaw += tankYawInc;
        var tankYawMat = Matrix.Rotation(tankYaw * 0.0174532925, $V([0,1,0]));

        var moveVec = [0,0,1];

	moveVec = tankYawMat.multiply($V(moveVec)).elements;

        if (speed) {
            tankPos.x += moveVec[0] * speed;
            tankPos.y += moveVec[1] * speed;
            tankPos.z += moveVec[2] * speed;
        }

        var trailVec = [0,0, -1 - (pitch * 0.02)];

        var trailPitchMat = Matrix.Rotation(pitch * 0.0174532925, $V([1,0,0]));
        var trailYawMat = Matrix.Rotation(trailYaw * 0.0174532925, $V([0,1,0]));

        trailVec = trailPitchMat.multiply($V(trailVec)).elements;
        trailVec = trailYawMat.multiply($V(trailVec)).elements;

        eye.x = tankPos.x + (trailVec[0] * 35);
        eye.y = tankPos.y + (trailVec[1] * 35);
        eye.z = tankPos.z + (trailVec[2] * 35);

        if (eye.y > 100.0) { eye.y = 100.0; }
        if (eye.y < 2.0) { eye.y = 2.0; }

	// do the websocket thing
	thisMesg = tankYaw +","+ eye.x +","+ eye.y +","+ eye.z +","+ tankPos.x +","+ tankPos.y +","+ tankPos.z;
        if (thisMesg != lastMesg) { // Alf update so send these numbers
                ws.send (thisMesg );
                lastMesg = thisMesg;
        }

        if (trailYaw > (tankYaw + 0.1)) {
            trailYaw -= (((trailYaw - tankYaw) * 0.01)) + 0.1;
        } else if (trailYaw < tankYaw) {
            trailYaw += (((tankYaw - trailYaw) * 0.01)) + 0.1;
        } 

        SceneJS.withNode("theLookAt").set({
		eye: eye,
                look: tankPos
        });

} else { // change camera for SLAVE
	if (!slaveFrame) { // if nothing to do leave.
            return;
        }

        var cam = cameraLookAt(eye, tankPos);
	var newUp = { x: cam.elements[1][0], y: cam.elements[1][1], z: cam.elements[1][2] };
	var cam = rotMat.multiply(cam);
	var newEye = { x: cam.elements[3][0], y: cam.elements[3][1], z: cam.elements[3][2] };
        var newTarget = {
		x: newEye.x - cam.elements[2][0],
		y: newEye.y - cam.elements[2][1],
		z: newEye.z - cam.elements[2][2]
        };

        SceneJS.withNode("theLookAt").set({
		eye: eye,
		look: newTarget,
		up: newUp
        });
	slaveFrame = false; // dealt with recvd frame data
} // end SLAVE camera setup

// common things to do with scene

        SceneJS.withNode("tankPos").set({
		x: tankPos.x,
		z: tankPos.z
        });

        SceneJS.withNode("tankRotate").set({
		//angle: tankYaw + 180 || 180
		angle: tankYaw
        });

        SceneJS.withNode("tankGunRotate").set({
		angle: -tankYaw
        });
}
});
