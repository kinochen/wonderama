# SceneJS Tron Tank on Liquid Galaxy WebGL Demo #

<img width='800' height='404' src='http://lh5.googleusercontent.com/-s5QRqge5_U0/ThfsHpWbTjI/AAAAAAAABTU/PsvM5ID93B0/s800/tron-wide.jpg'>

<h2>Introduction</h2>

Firstly a huge <b>thankyou</b> to <a href='http://www.retaggr.com/page/LindsayStanleyKay'>Lindsay Kay</a> and <a href='http://www.scenejs.org/'>SceneJS</a> for the Tron Tank demo, and <a href='http://www.greggman.com/'>Gregg Tavares</a> and Rehno for getting the view offset maths working!<br>
<br>
This is a hack to see if WebSocket/WebGL is viable for achieving view synchronisation on immersive multi-machine visualisation rigs. The test rig is a 5 screen curved tile-wall at the <a href='http://www.uws.edu.au/'>University of Western Sydney</a> based on <a href='http://code.google.com/p/liquid-galaxy/'>Google's Liquid Galaxy</a>.<br>
<br>
<pre><code>Master View ---websocket--&gt; WebSocket Relay ---websocket--&gt; { Slave View Left | ... | Slave View Right}<br>
</code></pre>

These variables are sent from the Master to the Slave instances -<br>
<br>
<ul><li>eyePos (x,y,z) - position of camera in the world<br>
</li><li>tankPos (x,y,z) - position of tank in the world<br>
</li><li>tankYaw (degrees) - rotation of tank wrt to grid plane</li></ul>

The middle machine is the <i>Master</i> view, from which we control the tank. View changes are synchronised with the <i>Slave</i> views looking slightly to the left and right.<br>
<br>
The camera on the <i>Master</i> always LooksAt tankPos (the is what the original demo does).<br>
<br>
The <i>Slaves</i> are arranged in a semi-circle, their views should be slightly to the 'left' and 'right' (yaw rotations). A a new camera view must be calculated on each <i>Slave</i>.<br>
<br>
<a href='http://www.youtube.com/watch?feature=player_embedded&v=uXelTp64Nwc' target='_blank'><img src='http://img.youtube.com/vi/uXelTp64Nwc/0.jpg' width='425' height=265 /></a><br>
<br>
<h2>How to Build</h2>

<ol><li>Grab the original "tron-tank" source from <a href='http://scenejs.org/dist/curr/extr/examples/tron-tank/index.html'>SceneJS examples site</a>. Place this on a local webserver. Test that the original Tron Tank app works with your browser.<br>
</li><li>Download the Perl libraries needed for "relay_websocket.pl" from <a href='http://showmetheco.de/articles/2010/11/timtow-to-build-a-websocket-server-in-perl'>How To build a WebSocket server in Perl</a>. Basically get ReAnimator installed and the demos working from <a href='https://github.com/vti/reanimator'>https://github.com/vti/reanimator</a>. May require some support libraries like EventReactor.<br>
</li><li>Run some of the example WebSocket Perl services. eg. the 'browser chat' to confirm WebSocket is working with your browser.<br>
</li><li>Download <b>tronlg.html</b>, <b>tron-tank-lg.js</b> and <b>relay_websocket.pl</b> from this source repo <a href='http://code.google.com/p/wonderama/source/browse/#svn%2Ftrunk%2Ftron-tank'>/trunk/tron-tank/</a>
</li><li>Place <b>tronlg.html</b> and <b>tron-tank-lg.js</b> in the examples/tron-tank folder for the scenejs tron tank (from step 1).<br>
</li><li>Place <b>relay_websocket.pl</b> in the examples/ folder for vti's ReAnimator Perl lib (from step 2). The relay is a basic modification of the "echo" example in that folder.<br>
</li><li>Modify <b>tron-tank-lg.js</b> replacing the WebSocket server IP address with the IP of the machine running your Perl WebSocket relay'er.<br>
</li><li>There are variables in <b>tron-tank-lg.js</b> to set the <code>fov</code> and <code>fovMulti</code> (bezel factor). If you've gotten this far, you'll know what to do!</li></ol>

<img width='288' align='right' height='200' src='http://lh3.googleusercontent.com/-bYHMhI3ZmCU/ThfqMz6AbnI/AAAAAAAABTM/94IXWApw3JU/s288/tron-big2.jpg'>
<h2>How to Run</h2>

<ol><li>Run the Perl service <b>./relay_websocket.pl</b>
</li><li>From a webgl browser on the middle machine access <b><a href='http://.../tronlg.html?master'>http://.../tronlg.html?master</a></b>
</li><li>on the right-hand screens access <b><a href='http://.../tronlg.html?rot=-1'>http://.../tronlg.html?rot=-1</a></b> or -2, -3, etc.<br>
</li><li>on the left-hand machines use <b><a href='http://.../tronlg.html?rot=1'>http://.../tronlg.html?rot=1</a></b> or 2, 3, etc.<br>
</li><li>Use mouse on the Master instance to control the tank and camera position.</li></ol>

You should run the Master (center) first, followed by the slaves. After the initial setup you can reload any instance (eg. pressing Ctrl-R) and things will work, since the Master view is the only one transmitting via websocket.<br>
<br>
<h2>What to Fix</h2>

<ul><li><del>slave view offsets aren't right, trying pitching up towards 90 degrees. 3D matrix maths anyone?</del>
<ul><li><del>probably something in cameraLookAt() function</del> <i>Slave needed to get 'up' vector from Master for setting it's LookAt 'up'</i>
</li></ul></li><li>the websocket relay needs more smarts to differentiate master and slave connections and a way to drop connections.<br>
<ul><li>should generate separate events eg. tank:id,x,y,z,yaw eye:x,y,z lookat:x,y,z<br>
</li><li>registering sets of master & slaves instances<br>
</li></ul></li><li><del>need to dynamically resize and fullscreen the canvas. CSS?</del> added CSS HTML body tags<br>
</li><li><del>the camera (eye) doesn't seem to go all the way down to the ground anymore. pitch code may be broken on master.</del> <i>eye.Y was limited to >20 reduced to 2</i>
</li><li>code cleanup because of my hack job!<br>
</li><li>could probably put a public version of this with websocket service on the interwebs? security?<br>
</li><li>producing the video has made me realise the tank is 180degrees out! Should be facing away from the camera not towards it. I've reversed tankYaw somewhere.</li></ul>

<h2>Future Ideas</h2>

It's unlikely I'm going to be able to do any of this, so go for it!<br>
<br>
<ul><li>only tested with Google Chrome (Canary), should try Firefox, non-dev Chrome, etc.<br>
</li><li>replace the Perl WebSocket relayer with something easier to package? NodeJS?<br>
<ul><li>How about a WebSocket 'service' in JavaScript on the Master instance?<br>
</li></ul></li><li>will need to track SceneJS versions and updates to Lindsay's 'Tron Tank'.<br>
</li><li>grid texture is a bit so-so, replace it with better image or draw it.<br>
</li><li>on the slave display "Waiting for MCP link." until the first Master view packet arrives.<br>
</li><li>sky/box around grid field.<br>
</li><li>cast a shadow beneath tank?<br>
</li><li>home key press to return to the middle of the grid.<br>
</li><li>user-controled or orbiting camera in addition to the "swing to front" cam.<br>
</li><li>driving the tank point-of-view cam.<br>
</li><li>animate tracks on tank model.<br>
</li><li>object detection. at the moment the tank can drive through walls.<br>
</li><li>procedural city/block model generator.<br>
</li><li>ability to fire the canon (projectile + recoil) and blow stuff up!<br>
</li><li>need to find a SpaceNavigator Javascript control? Perhaps <a href='http://code.google.com/p/javascript-joystick/'>javascript-joystick</a> will do.<br>
</li><li>sound fx, followed by spatial sound fx<br>
</li><li>other tanks and light cycles.<br>
</li><li>multiplayer tanks, network play, etc.<br>
</li><li>2d overview map, compass, radar, headsup display, map/maze builder<br>
</li><li>revitalize and/or re-use code from <a href='http://kernigh.pbworks.com/w/page/9214137/Xtank'>Xtank</a> (early 1990's) or <a href='http://www.gltron.org/'>GLtron</a>  <i>...getting carried away...</i></li></ul>
