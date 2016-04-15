# Microsoft Kinect Surfer Controller for Google Earth #

<a href='http://www.youtube.com/watch?feature=player_embedded&v=ULp6VaFtwz4' target='_blank'><img src='http://img.youtube.com/vi/ULp6VaFtwz4/0.jpg' width='425' height=265 /></a>

Version 1 - PX project in Autumn 2012. Students: Johnothan Weightman & Jarred.

Version 2 - PX project for Spring 2012. This is the most recent version uploaded to the Source folder. See the SurferGuide for installation and user guide. Students: Michael Hook, Sven, ..., ..., ....

Version 3 - is being worked on March-May 2013 (Autumn semester at UWS) as a CP2 project. Student: Michael Hook.

## What is here? ##

Source is in /trunk/ and a zip package for the Kinect Server is in downloads

A Windows PC with the Microsoft Kinect SDK installed and a Kinect for Windows run a service which delivers the skeleton joint data as a WebSocket stream to a JavaScript application.
This app uses the data to control the Earth API camera.
Surfer.html takes the URL arguments ?master=true or ?master=false.

### Console App ###

The **console.html** is another web app that provides feedback to the surfer.
Includes - groundspeed & altitude; a real-time 2d representation of the users skeleton as seen by the Kinect; a Google Map showing location & heading of the surfer; bandwidth charts for the Internet and internal LAN data usage (confirms benefit of caching!); and a dump of the WebSocket stream.

tablet.html is for our control tablet.

Supporting /images/ and DAE /models/ (to be removed as not needed for v2 onwards) are in the appropriate folders on this site.