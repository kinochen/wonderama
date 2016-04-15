# Wonderama Professional Experience Project Opportunities #

The Wonderama is available for Professional Experience Students (Unit 300579) to undertake interesting projects on.

## General Background ##

The Wonderama is a virtual reality display system based on the [Google's Liquid Galaxy](http://code.google.com/p/liquid-galaxy/). The system comprises a cluster of networked PC's with the screens arranged in a curve. Applications running on the PC's use a variety of techniques to give the sensation of a single panoramic view. The rig is installed with both Windows and a Linux operating environment. The 'killer app' is Google Earth running as a wrap-around immersive panorama.

## Spring 2011 PX Project Ideas ##

Suggested project ideas for PX students listed below. Also see [Liquid Galaxy Ideas Page](http://code.google.com/p/liquid-galaxy/wiki/IdeasPage) for additional possibilities.

### 1. Google Earth Plugin based version of Wonderama ###

Currently the full Google Earth Client is used to generate a multi-screen Google Earth panorama. This project will investigate the feasibility of using the Google Earth Web Browser Plugin to simplify the setup of an immersive Google Earth experience. Additionally there are a heap of plugin-based apps that would be great to get running on the Wonderama. eg. [Planet In Action games](http://www.planetinaction.com/)

  * Be comfortable with HTML and JavaScript/CSS, web server scripting (CGI/PHP).
  * Solutions to investigate include
    * using ViewSync to connect instances
    * JavaScript/WebSocket code to connect instances
    * Multiple instances of the plugin on one machine?
  * Perhaps try some setups with a mix of full GE client and plugin?
  * Only requires access to a couple of PC's for development and testing.

### 2. Application to convert Google Earth Tours to run on Liquid Galaxy ###

There are lots of Google Earth Tours available, these are a great resource to use on the immersive visualisation rigs. These tours do run on the Wonderama but they are designed for single screen version of Google Earth. We need a method to _up convert_ them so they can take advantage of the multi-screen Wonderama system.

  * pull apart and understand the Google Earth tour format. The tours uses plain text KML format
  * use an XML parser or similar to read the KML Tours
  * generate extensions to the tours suitable for panoramic rigs
  * export the modified tour in a form that can then be played on multiple machines
  * investigate tour timing across multiple instances, discuss with Adam at End Point
  * [Example of Redwood Tour on Wonderama](http://www.youtube.com/watch?v=O1ypGRoPyj8)
  * Only requires Wonderama access for testing of immersive tours (towards end of project). Most of the work can be done on a standalone PC.

### 3. Configuration Builder and/or Setup Wizard ###

Create a simple installer for app for setting up Liquid Galaxy on multiple machines. Windows O/S at a minimum, but Mac and Linux would also be nice.

  * Single click installer
  * Downloads Google Earth app (if needed)
  * Asks for network configuration information
  * Asks for monitor angle configuration
  * Sets up default Google Earth layers and other settings
  * Create icon on desktop
  * Doesn't require access to the rig till end end (for install testing). A couple of PC's to setup Google Earth on would do for most of the project.

### 4. Racing Car wheel controller for Google Earth StreetView ###

We have a Logitech Momo force feedback gaming wheel we'd like to use a controller for the rig when it is in Street View mode. Basically so we can use Google Earth as a very lame car racing game! Part of the project might be to setup other controllers which are already known to work (Android and Kinect?).

  * controlling Google Earth from USB input, could be like Joystick, not sure?
  * how to map wheel to road directions?
  * the wheel uses basically two axis - rotate around y axis (turn left or right) and go forward!
  * possibly incorporate feedback when "off road"
  * we have examples of other controllers being used with Google Earth eg. Android and Kinect. This might be like a simply joystick though.
  * [Example of StreetView on Wonderama](http://www.youtube.com/watch?v=f5Pr-n-xumA)
  * doesn't require access to the Wonderama (except for testing towards the end). A single PC with Google Earth and the appropriate controller device would be enough. Two PC's would be better.

### 5. Additional into-the-mix ideas ###

  * UWS Open Day Sunday 29 August - Kinect controller setup for GE
  * Wonderama website/wiki build - Confluence.
  * Wonderama machine build and deploy process, dual-boot maintenance.
  * Google Earth usability and UWS data sources.
  * geolocating sounds in GE.
  * 3D model building for HIE and UWS.
  * panoramic video streaming.

## Particulars about Wonderama projects at UWS ##

  * The rig is physically located at Kingswood campus in room Y230, this lab is available only to PX students and is available 7am-9pm (or later) and on weekends. However most of these projects can be easily setup with 1 or 2 PC's (laptops).
  * Weekly status updates via a project wiki and/or meeting with client (Andrew). The meetings can be face-to-face or video conference.
  * I don't particularly want printed documentation, your code along with wiki-pages is all that I require. However your supervising academic may require additional documentation.
  * A rough project plan at the end of Week 3. Showing what you expect to work on for the semester.
    * describe what you hope to achieve.
    * list any technical resources that you require to complete the project.
    * any issues you can currently foresee.

## Glossary ##

  * **LG** = Liquid Galaxy
  * **GE** = Google Earth
  * **GEC** = the standalone Google Earth Client
  * **the rig** / **vis rig** = the immersive Wonderama setup