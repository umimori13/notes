import os
import matplotlib.pyplot as plt
import cv2
import numpy as np
  
def resize_img(img_path, img_name, save_path,width,height):
   imgg=img_path+img_name
   img = cv2.imread(imgg)

   dim = (width, height)
   resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
   print(resized)
   cv2.imwrite(save_path + '{}.jpg'.format(img_name[-7:-4]),resized,[int( cv2.IMWRITE_JPEG_QUALITY), 100])

  
  
if __name__ == '__main__':
  
  img_path = 'D:\\image\\'
  img_list = os.listdir(img_path)
  print(img_list)
  for name in img_list:
    # newName = name[-7:-4]
    save_path = 'D:\\noRes\\'
    if os.path.isdir(save_path):  ##不用加引号，如果是多级目录，只判断最后一级目录是否存在
        resize_img(img_path,name,save_path,512,256)
        pass
    else:
        os.mkdir(save_path)
        resize_img(img_path,name,save_path,512,256)
    

