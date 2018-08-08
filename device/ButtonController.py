import RPi.GPIO as GPIO
import config 
import time

class ButtonController():
    def __init__(self):
        self._setup()
        self._buffer = []
        self._matrix = [[1,2,3],[4,5,6],[7,8,9],['*',0,'#']]  
        self._is_enable = False
        self._star_task = None
        self._password_correct_task = None
        self._password = [5,6,7,8]

    def _setup(self):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(config.BUTTON_ROW_PIN[0], GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(config.BUTTON_ROW_PIN[1], GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(config.BUTTON_ROW_PIN[2], GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(config.BUTTON_ROW_PIN[3], GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(config.BUTTON_COL_PIN[0], GPIO.OUT)
        GPIO.setup(config.BUTTON_COL_PIN[1], GPIO.OUT)
        GPIO.setup(config.BUTTON_COL_PIN[2], GPIO.OUT)

    def _destroy(self):
        GPIO.cleanup()

    def _detect(self):
        GPIO.output(config.BUTTON_COL_PIN[0],1)
        GPIO.output(config.BUTTON_COL_PIN[1],1)
        GPIO.output(config.BUTTON_COL_PIN[2],1)
        print('button is enable')
        while self._is_enable:
            for indexC,c in enumerate(config.BUTTON_COL_PIN):
                GPIO.output(c,0)
                for indexR,r in enumerate(config.BUTTON_ROW_PIN):
                    if (GPIO.input(r) == 0):
                        self._buffer.append(self._matrix[indexR][indexC])      
                        self._process_buffer()
                        while GPIO.input(r) == 0:
                            time.sleep(0.1)
                GPIO.output(c,1)
    def enable(self):
        self._is_enable = True
        self._detect()

    def disable(self):
        self._is_enable = False

    @property
    def star_task(self):
        return self_star_task

    @star_task.setter
    def star_task(self, task):
        self._star_task = task

    @property
    def password_correct_task(self):
        return self._password_correct_task

    @password_correct_task.setter
    def password_correct_task(self, task):
        self._password_correct_task = task

    def _check_password(self):
        if (len(self._buffer) != len(self._password) + 1):
            return False
        for i in range(len(self._password)):
            if (self._buffer[i] != self._password[i]):
                return False
        return True
                    
    def _process_buffer(self):
        print('buffer :',self._buffer)
        if(self._buffer[-1] == "*"):
            self.disable()
            self._star_task()
            self.enable()
        elif(self._buffer[-1] == "#"):
            pass
            #self._check_password()
            #self._password_correct_task()
        self._buffer = []
