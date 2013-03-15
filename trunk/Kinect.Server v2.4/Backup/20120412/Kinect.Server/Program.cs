using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fleck;
using Microsoft.Kinect;

namespace Kinect.Server {
    class Program {
        //static KinectSensor _nui;
        static List<IWebSocketConnection> _sockets;

        static bool _initialized = false;

        static void Main(string[] args) {
            if (KinectSensor.KinectSensors.Count <= 0) return;
            KinectSensor sensor = KinectSensor.KinectSensors[0];
            //KinectSensor derp = null;

            InitilizeKinect(sensor);
            InitializeSockets();
        }

        private static void InitializeSockets() {
            _sockets = new List<IWebSocketConnection>();

            var server = new WebSocketServer("ws://localhost:8181");

            server.Start(socket => {
                socket.OnOpen = () => {
                    Console.WriteLine("Connected to " + socket.ConnectionInfo.ClientIpAddress);
                    _sockets.Add(socket);
                };
                socket.OnClose = () => {
                    Console.WriteLine("Disconnected from " + socket.ConnectionInfo.ClientIpAddress);
                    _sockets.Remove(socket);
                };
                socket.OnMessage = message => {
                    Console.WriteLine(message);
                };
            });

            _initialized = true;

            Console.ReadLine();
        }

        private static void InitilizeKinect(KinectSensor sensor)
        {
            /*
            _nui = KinectSensor.KinectSensors[0];
            _nui.Initialize(RuntimeOptions.UseDepthAndPlayerIndex | RuntimeOptions.UseSkeletalTracking);
            _nui.SkeletonFrameReady += new EventHandler<SkeletonFrameReadyEventArgs>(Nui_SkeletonFrameReady);
             */
            sensor.SkeletonStream.Enable();
            sensor.Start();
            sensor.SkeletonFrameReady += new EventHandler<SkeletonFrameReadyEventArgs>(Nui_SkeletonFrameReady);
        }

        static void Nui_SkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e) {

            
            //Skeleton[] skeletons;
            //Skeleton[] skeletons;
            bool receivedData = false;
            using (SkeletonFrame skeletonFrame = e.OpenSkeletonFrame()) {
                if (skeletonFrame != null) {
                    
                    //if (skeletons == null) {
                    //if(skeletons.tracked = true or something) {
                        //skeletons.Add(new Skeleton[skeletonFrame.SkeletonArrayLength]);
                        Skeleton[] skeletons = new Skeleton[skeletonFrame.SkeletonArrayLength];
                        //Console.WriteLine("here i am");
                        /*var addskels = new Skeleton[skeletonFrame.SkeletonArrayLength];
                        skeletons.Add(addskels);*/
                    //}
                    receivedData = true;
                } else {
                    // apps processing of skeleton data took too long; it got more than 2 frames behind.
                    // thedata is no longer avabilable.
                }
                if (receivedData) {
                    string json = skeletons.Serialize();

                    //string json = skeletonFrame.CopySkeletonDataTo(

                    foreach (var socket in _sockets) {
                        /*SkeletonFrame allSkeletons = e.OpenSkeletonFrame();
                        Skeleton playerSkeleton = (from s in skeletons where s.TrackingState == SkeletonTrackingState.Tracked select s).FirstOrDefault();
                        Joint rightHandJoint = playerSkeleton.Joints[JointType.HandRight];*/
                        //Console.WriteLine("working");
                        socket.Send(json);
                    }
                }

            }
        }
    }
}