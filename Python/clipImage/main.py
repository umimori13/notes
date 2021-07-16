import os
import matplotlib.pyplot as plt
import cv2
import numpy as np
  
def divide_img(img_path, img_name, save_path):
   imgg=img_path+img_name
   img = cv2.imread(imgg)
#    print(imgg)
#   img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
   h = img.shape[0]
   w = img.shape[1]
   n=4
   m=8
#    print('h={},w={},n={},m={}'.format(h,w,n,m))
   dis_h=int(np.floor(h/n))
   dis_w=int(np.floor(w/m))
   num=0
   for i in range(n):
     for j in range(m):
       num+=1
    #    print('i,j={}{}'.format(i,j))
       sub=img[dis_h*i:dis_h*(i+1),dis_w*j:dis_w*(j+1),:]
       cv2.imwrite(save_path + '{}.jpg'.format(num),sub)
    # ,[int( cv2.IMWRITE_JPEG_QUALITY), 90]
  
  
if __name__ == '__main__':
  
  img_path = 'D:\\image\\'
  img_list = os.listdir(img_path)
#   img_list= img_list[:3]
  print(img_list)
  for name in img_list:
    newName = name[-7:-4]

    first_path = 'D:\\hiRes\\'
    if os.path.isdir(first_path):  ##不用加引号，如果是多级目录，只判断最后一级目录是否存在
        pass
    else:
        os.mkdir(first_path)

    save_path = 'D:\\hiRes\\'+newName+'\\'
    if os.path.isdir(save_path):  ##不用加引号，如果是多级目录，只判断最后一级目录是否存在
        pass
    else:
        os.mkdir(save_path)
        divide_img(img_path,name,save_path)
