using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using Microsoft.Kinect;
using System.IO;
using System.Text;
using System.Runtime.Serialization;

namespace Kinect.Server
{
    /// <summary>
    /// Serializes a Kinect skeleton to JSON fromat.
    /// </summary>
    public static class SkeletonSerializer
    {
        [DataContract]
        class JSONSkeleton
        {
            [DataMember(Name = "joints")]
            public List<JSONJoint> Joints { get; set; }
        }

        [DataContract]
        class JSONJoint
        {
            [DataMember(Name = "x")]
            public float X { get; set; } 

            [DataMember(Name = "y")]
            public float Y { get; set; }

            [DataMember(Name = "z")]
            public float Z { get; set; }
        }

        public static string Serialize(this Skeleton skeletons)
        {
            JSONSkeleton jsonSkeleton = new JSONSkeleton
            {
                Joints = new List<JSONJoint>()
            };

            foreach (Joint joint in skeletons.Joints)
            {
                Joint scaled = joint.ScaleTo(640, 480);

                jsonSkeleton.Joints.Add(new JSONJoint
                {
                    X = scaled.Position.X,
                    Y = scaled.Position.Y,
                    Z = scaled.Position.Z
                });
            }

            return Serialize(jsonSkeleton);
        }

        // Resource: http://pietschsoft.com/post/2008/02/NET-35-JSON-Serialization-using-the-DataContractJsonSerializer.aspx.
        private static string Serialize(object obj)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
            MemoryStream ms = new MemoryStream();
            serializer.WriteObject(ms, obj);
            string retVal = Encoding.Default.GetString(ms.ToArray());
            ms.Dispose();

            return retVal;

        }

    }

}
