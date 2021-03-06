import cv2
import time

class Camera:
    def __init__(self):
        self.cap = None
        self.frame = []

    def CatchImage(self):
        if(not self.cap):
            self.__openCamera()
        ret, frame = self.cap.read()
        return frame

    def SaveImage(self,path,imageFrame):
        cv2.imwrite(path,imageFrame)
    
    def __openCamera(self):
        self.cap = cv2.VideoCapture(0)

    def __closeCamera(self):
        self.cap.release()
