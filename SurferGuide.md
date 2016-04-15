# Kinect Surfer 2.0 Installation and User Guide #

## Minimum requirements ##

  * Kinect for Windows
  * Internet connection: 512K broadband
  * Operating System: **Windows 7 or Windows 8** (Kinect SDK requirement)
  * CPU: 32 bit (x86) or 64 bit (x64) Dual-core 2.66-GHz or faster processor
  * System Memory (RAM): 2GB+
  * Hard Disk: 2GB free space
  * Network Speed: 128 Kbits/sec
  * Graphics Card: DirectX 9 and 3D capable with 256MB of VRAM
  * Screen: 1024x768, "16-bit High Colour" - DirectX 9
  * Kinect SDK version 1.5 or later
  * Google Chrome
  * Google Earth browser Plug-in

## Hardware Setup ##

The Kinect camera needs to be positioned at a 90 degree angle on the left side of your display at a height of one metre. You can use a stand or a small table, as long as the Kinect’s view is not obstructed.

The user should be roughly about one metre away from the display and about a metre away from the Kinect camera on the left. Adjustments can be made after software setup.


![https://wonderama.googlecode.com/files/image001.jpg](https://wonderama.googlecode.com/files/image001.jpg)


---


## Software needed to run Surfer 2.0 ##

### 1. Microsoft Kinect SDK ###

http://www.microsoft.com/en-us/kinectforwindows/develop/developer-downloads.aspx

Download and install the latest SDK version.
<br />

### 2. Google Chrome Browser ###

Chrome link:
https://www.google.com/intl/en/chrome/browser/?brand=CHMA&utm_campaign=en&utm_source=en-ha-aunz-ct&utm_medium=ha
<br />

### 3. Google Earth Plugin ###

Plugin link:
http://www.google.com/earth/explore/products/plugin.html
<br />


---


## Installation of Surfer 2.0 ##

After you have connected the Kinect camera to your PC you will need two components to be able to run Surfer 2.0:

1. The **Kinect.Server v2.4** folder

2. The **Kinect Surfer v2.0** folder

These folders can be downloaded together as a zip file from:  http://code.google.com/p/wonderama/downloads/list

You need to run the server first, and then open the surfer in the browser.

To start the server, open the **Kinect.Server v2.4** folder **>** Kinect.Server folder **>** bin folder **>** Release folder.
Then run the **Kinect.Server** application and the server will start:

![https://wonderama.googlecode.com/files/image010.jpg](https://wonderama.googlecode.com/files/image010.jpg)

(You must connect and power the Kinect camera before you start the server or it will crash!)

Leave the server running.

Now open the **Kinect Surfer v2.0** folder, right click on the **surfing.htm** file and open with Google Chrome (F11 to fullscreen).

The Kinect automatically detects the user, you are now surfing!

The Surfer has a default 1920x1200 resolution setup for a 24 inch widescreen display.

To change the resolution you will need to edit the CSS in surfing.htm


---


## Using console.htm to ensure the user is within the Kinect frame ##

Now that the Surfer is setup and running you need to open console.htm with Chrome to be able to see the position of the user in the Kinect’s frame.

**Console.htm** is in the **Kinect Surfer v2.0 folder** and when opened in Chrome displays a representation of the user’s skeleton joints.
The user’s head, feet and hands should all be within the blue “dot man” canvas.
<br />

---

## The Surfing stance ##

The surfing stance is a stance that is “side on” to the Kinect camera with your head facing the display. The image below shows the surfing stance; the user’s right hand (green) is pointing towards the display (the image is from the Kinect camera’s perspective).

![https://wonderama.googlecode.com/files/image012.gif](https://wonderama.googlecode.com/files/image012.gif)

The recommended stance is one with your right foot forward. You can surf with your left foot forward and with your back to the Kinect but it is not as responsive.

## Controlling the Surfer ##

The Surfer controls the camera in Google Earth in three ways; pitch, roll and yaw. It basically turns your body into a large joystick and uses your joints to dictate the pitch, roll, yaw and acceleration. The image below shows the pitch, roll and yaw of a space shuttle, when surfing your shoulders and arms represent the length of the shuttle.

![https://wonderama.googlecode.com/files/image013.gif](https://wonderama.googlecode.com/files/image013.gif)

The shoulders turning left or right control the yaw, the angle of the shoulders moving up or down control the pitch and the body leaning forward or backwards, controls the roll.

**The forward movement (acceleration) of the surfer is controlled by the distance between the forward wrist and the forward shoulder.**

The further away the wrist is from the shoulder the faster you will travel. Likewise the closer the wrist is to the shoulder the slower you will travel. To stop moving forward, simply drop both your wrists below your waist. Remember to keep your shoulders as parallel to the Kinect camera as possible.

**Occasionally the Surfer will not detect the user, if this happens step towards the Kinect camera and then back into position.**<br />

---


## Troubleshooting ##

  * Make sure you are connected to the internet. Google Earth Plugin requires an internet connection!

  * Try plugging the Kinect into a different USB port if your PC is not detecting the Kinect

  * Make sure the power adapter is connected to the USB cable, The Kinect will have a green light if connected properly

  * Make sure you are using Kinect SDK version 1.5 or later

  * Ensure you connect (and power) the Kinect sensor before you start the Surfer 2.0 server

  * If the plugin has crashed, refresh Chrome

  * Surfer 2.0 has been optimised for Chrome! Chrome may not be set as your preferred browser in Windows make sure you are opening Surfing.htm with Chrome!


---


Kinect Surfer 2.0 is an ongoing Kinect NUI and Liquid Galaxy project undertaken by eResearcher Andrew Leahy and students of the University of Western Sydney. It uses html5 Web Sockets to deliver skeleton joint data from an Apache server (c#) to a web application written in Javascript.

The code has been made public to enable collaboration so please feel free to develop the code!

If you have any problems or wish to provide feedback please contact us:

Michael Hook                                                          [hookmike20@gmail.com](mailto:hookmike20@gmail.com)

Andrew Leahy
[a.leahy@uws.edu.au](mailto:a.leahy@uws.edu.au)