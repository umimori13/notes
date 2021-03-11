# Simple talker demo that listens to std_msgs/Strings published
# to the 'chatter' topic

import websockets
import rospy
import sensor_msgs.point_cloud2 as pc2
import asyncio
import random
# import websocket


from sensor_msgs.msg import PointCloud2, PointField

a = 0
send_data = None
# def callback(data):
#     print(data)
#     rospy.loginfo(rospy.get_caller_id() + 'I heard %s', data.data)
def ros_to_pcl(ros_cloud):
    """ Converts a ROS PointCloud2 message to a pcl PointXYZRGB

        Args:
            ros_cloud (PointCloud2): ROS PointCloud2 message

        Returns:
            pcl.PointCloud_PointXYZRGB: PCL XYZRGB point cloud
    """
    points_list = []

    for data in pc2.read_points(ros_cloud, skip_nans=True):
        points_list.append([data[0], data[1], data[2], data[3]])
        # print(data,end='\n')

    global a
    global send_data
    send_data= points_list
    a+=1
    # pcl_data = pcl.PointCloud_PointXYZRGB()
    # pcl_data.from_list(points_list)
    # for data in pcl_data:
    #     print(data,end='\n')
    # print(points_list, end="\n")
    return 


def listener():

    # In ROS, nodes are uniquely named. If two nodes with the same
    # name are launched, the previous one is kicked off. The
    # anonymous=True flag means that rospy will choose a unique
    # name for our 'listener' node so that multiple listeners can
    # run simultaneously.
    print('hello, I begin')
    rospy.init_node('listener', anonymous=False)
    
    rospy.Subscriber('sxhpoint', PointCloud2, ros_to_pcl)
    # print(res)
    # spin() simply keeps python from exiting until this node is stopped
    # rospy.spin()

async def server(websocket, path):
    global a
    global send_data
    listener()
    while True:
    #     # now = datetime.datetime.utcnow().isoformat() + "Z"
    #     # print(now)
        print(a)
        await websocket.send(str(send_data))
        # await asyncio.sleep(0.005 )
        # print(a)

if __name__ == '__main__':
    print('hello, I begin')
    # while True:
    start_server = websockets.serve(server, "*", 5678)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
