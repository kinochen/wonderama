using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fleck;
using Microsoft.Kinect;

namespace Kinect.Server
{
    class Program
    {
        static List<IWebSocketConnection> _sockets;
        static KinectSensor sensor = KinectSensor.KinectSensors.FirstOrDefault(s => s.Status == KinectStatus.Connected); // Get first Kinect Sensor
        static float closestdistance = 10000f; // start with a far enough distance
        static int closestid = 0;

        static void Main(string[] args)
        {
            if (KinectSensor.KinectSensors.Count <= 0) return;

            InitilizeKinect(sensor);
            InitializeSockets();
        }

        private static void InitializeSockets()
        {
            _sockets = new List<IWebSocketConnection>();

            var server = new WebSocketServer("ws://localhost:8181");

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine("Connected to " + socket.ConnectionInfo.ClientIpAddress);
                    _sockets.Add(socket);
                };
                socket.OnClose = () =>
                {
                    Console.WriteLine("Disconnected from " + socket.ConnectionInfo.ClientIpAddress);
                    _sockets.Remove(socket);
                };
                socket.OnMessage = message =>
                {
                    Console.WriteLine(message);
                };
            });

            Console.ReadLine();
        }

        public static void InitilizeKinect(KinectSensor sensor)
        {
            try
            {
                sensor.SkeletonStream.Enable(new TransformSmoothParameters()
                {
                    Correction = 0.5f,
                    Prediction = 0.5f,
                    Smoothing = 0.5f,
                    JitterRadius = 0.01f,
                    MaxDeviationRadius = 0.01f
                });
            }
            catch (ArgumentOutOfRangeException outOfRange)
            {
                Console.WriteLine("Error: {0}", outOfRange.Message);
                sensor.SkeletonStream.Enable();
            }

            sensor.Start();

            if (sensor != null && sensor.SkeletonStream != null)
            {
                if (!sensor.SkeletonStream.AppChoosesSkeletons)
                {
                    sensor.SkeletonStream.AppChoosesSkeletons = true; // ensure app chooses skeletons is set
                }
            }

            sensor.SkeletonFrameReady += new EventHandler<SkeletonFrameReadyEventArgs>(Nui_SkeletonFrameReady);

            Console.WriteLine("Correction " + sensor.SkeletonStream.SmoothParameters.Correction);
            Console.WriteLine("Prediction " + sensor.SkeletonStream.SmoothParameters.Prediction);
            Console.WriteLine("Smoothing " + sensor.SkeletonStream.SmoothParameters.Smoothing);
            Console.WriteLine("JitterRadius " + sensor.SkeletonStream.SmoothParameters.JitterRadius);
            Console.WriteLine("MaxDeviationRadius " + sensor.SkeletonStream.SmoothParameters.MaxDeviationRadius);
        }

        private static void Nui_SkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
        {

            using (SkeletonFrame skeletonFrame = e.OpenSkeletonFrame()) // Open the Skeleton frame
            {
                if (skeletonFrame != null)                              // check that a frame is available
                {
                    Skeleton[] skeletons = new Skeleton[skeletonFrame.SkeletonArrayLength];
                    int TotalSkeletons = skeletonFrame.SkeletonArrayLength;
                    int counter = 0;
                    skeletonFrame.CopySkeletonDataTo(skeletons);       // get the skeletal information in this frame

                    foreach (Skeleton S in skeletons)
                    {

                        if (S.ClippedEdges.HasFlag(FrameEdges.Left) || S.ClippedEdges.HasFlag(FrameEdges.Right))
                        {
                            S.TrackingState = SkeletonTrackingState.NotTracked;
                            closestdistance = 10000f;
                            closestid = 0;
                            skeletonFrame.Dispose();
                        }

                        if (S.TrackingState != SkeletonTrackingState.NotTracked)
                        {

                            if (S.Position.Z < closestdistance)
                            {
                                closestid = S.TrackingId;
                                closestdistance = S.Position.Z;
                            }

                            if (closestid > 0)
                            {
                                sensor.SkeletonStream.ChooseSkeletons(closestid); // track this skeleton
                                if (S.TrackingId == closestid)
                                {
                                    string json = S.Serialize();
                                    foreach (var socket in _sockets)
                                    {
                                        socket.Send(json); // send JSON via websocket
                                    }
                                }

                            }

                        }

                        if (S.TrackingState == SkeletonTrackingState.NotTracked)
                        {
                            counter++;

                            if (counter == TotalSkeletons)
                            {
                                closestdistance = 10000f;
                                closestid = 0;
                            }
                        }
                    }
                }


                else
                {
                    // beware of using loops!
                }
            }
        }

    }

}

