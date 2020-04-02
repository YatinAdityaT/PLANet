import io
import cv2
import os
import flask
import base64 
import requests
import winsound
import numpy as np
from PIL import Image
from io import StringIO
from tensorflow.keras.models import *
from tensorflow.keras import backend as keras
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing.image import ImageDataGenerator,img_to_array
from tensorflow.keras.applications.resnet50 import decode_predictions, preprocess_input
from flask import Flask,render_template,request,redirect,url_for,session,flash,jsonify,Response

# from base64 import decodestring

global ROI
global model
global predictions

predictions = {'label':'','prob':''}

default = {'R_l': 0, 'G_l': 0, 'B_l': 0, 'R_h': 255, 'G_h': 255, 'B_h': 255}
        
def make_noise(number):
    duration = 200  # milliseconds
    freq = 2240     # Hz
    for i in range(number):
            winsound.Beep(freq, duration)

def nothing(useless=None):
    pass

def grab_json(url):
    resp = requests.get(url=url)
    dic = resp.json()
    return dic


def gen_frames():  
    data_send = default
    resp = requests.post(url+'/jsondata', data = data_send)
    cap = cv2.VideoCapture(0)
    
    while True:
        dic = grab_json(url+'/jsondata') # this will make a get request to the url

        if dic == None:
            raise Exception("dic is none!") 

        R_l = int(dic['R_l'])
        G_l = int(dic['G_l'])
        B_l = int(dic['B_l'])

        R_h = int(dic['R_h'])
        G_h = int(dic['G_h'])
        B_h = int(dic['B_h'])

        _,frame = cap.read()
        blurred_frame = cv2.blur(frame,(5,5),0)    
        hsv_frame = cv2.cvtColor(blurred_frame,cv2.COLOR_BGR2HSV)

        #Defining color theshold
        low_green = np.array([R_l, G_l, B_l])
        high_green = np.array([R_h, G_h, B_h])
        print(low_green,high_green)
        green_mask = cv2.inRange(hsv_frame, low_green, high_green)

        #Morphological adjestments
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        opening = cv2.morphologyEx(green_mask, cv2.MORPH_OPEN, kernel, iterations=1)
        close = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=1)

        #Getting the largest contour
        contours,_ = cv2.findContours(green_mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_NONE)    

        try:

            biggest = sorted(contours,key=cv2.contourArea,reverse=True)[0]
            cv2.drawContours(frame,biggest,-1,(0,0,0),1)

            #Creating blank mask and filling in the contour
            blank_mask = np.zeros(frame.shape, dtype=np.uint8)
            cv2.fillPoly(blank_mask, [biggest], (255,255,255))
            blank_mask = cv2.cvtColor(blank_mask, cv2.COLOR_BGR2GRAY)
            global ROI
            ROI = cv2.bitwise_and(frame,frame,mask=blank_mask)

            os.remove('static/temporary/temp_img.bmp')
            cv2.imwrite('static/temporary/temp_img.bmp',ROI)

            _, buffer_roi = cv2.imencode('.jpg', ROI)
            f_roi = buffer_roi.tobytes()

            _, buffer_frame = cv2.imencode('.jpg', frame)
            f_frame = buffer_frame.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpg\r\n\r\n' + f_roi + b'\r\n')

        except IndexError:
            print('indexerror!!')
            pass


def single_image():  
    #positing slider values for the first time
    data_send = default
    resp = requests.post(url+'/jsondata', data = data_send)

    frame =  cv2.imread('static/temporary/temp_img.bmp') 
    
    while True:
        dic = grab_json(url+'/jsondata') # this will make a get request to the url

        if dic == None:
            raise Exception("dic is none!") 

        R_l = int(dic['R_l'])
        G_l = int(dic['G_l'])
        B_l = int(dic['B_l'])

        R_h = int(dic['R_h'])
        G_h = int(dic['G_h'])
        B_h = int(dic['B_h'])

        blurred_frame = cv2.blur(frame,(5,5),0)    
        hsv_frame = cv2.cvtColor(blurred_frame,cv2.COLOR_BGR2HSV)

        #Defining color theshold
        low_green = np.array([R_l, G_l, B_l])
        high_green = np.array([R_h, G_h, B_h])
        print(low_green,high_green)
        green_mask = cv2.inRange(hsv_frame, low_green, high_green)

        #Morphological adjestments
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        opening = cv2.morphologyEx(green_mask, cv2.MORPH_OPEN, kernel, iterations=1)
        close = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=1)

        #Getting the largest contour
        contours,_ = cv2.findContours(green_mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_NONE)    

        try:
            biggest = sorted(contours,key=cv2.contourArea,reverse=True)[0]
            cv2.drawContours(frame,biggest,-1,(0,0,0),1)

            #Creating blank mask and filling in the contour
            blank_mask = np.zeros(frame.shape, dtype=np.uint8)
            cv2.fillPoly(blank_mask, [biggest], (255,255,255))
            blank_mask = cv2.cvtColor(blank_mask, cv2.COLOR_BGR2GRAY)
            global ROI
            ROI = cv2.bitwise_and(frame,frame,mask=blank_mask)

            os.remove('static/temporary/temp_img.bmp')
            cv2.imwrite('static/temporary/temp_img.bmp',ROI)

            _, buffer_roi = cv2.imencode('.jpg', ROI)
            f_roi = buffer_roi.tobytes()

            _, buffer_frame = cv2.imencode('.jpg', frame)
            f_frame = buffer_frame.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpg\r\n\r\n' + f_roi + b'\r\n')

        except IndexError:
            print('indexerror!!')
            pass

def prepare_image(image,target_size,flag=False):
    if flag:
        print('flag=true')
        image = Image.fromarray(image, 'RGB')
        print(type(image))
    if image.mode!="RGB":
        image = image.convert("RGB")
    if flag:
        image = image.resize((target_size[0],target_size[1]))
    else:
        image = image.resize(target_size)

    image = img_to_array(image)
    image = np.expand_dims(image,axis=0)
    return image

def save_roi_at_location(folders):
    path = 'dataset/'+folders['speciesSelectedValue']+"   "+folders['diseaseSelectedValue']
    print(os.listdir())
    i = str(len(os.listdir(path)) + 1)
    image_path = path+'/'+i+'.jpg'
    cv2.imwrite(image_path,ROI)
    print('image saved')

def give_predictions(image,SelectedValue):
    species = ['Apple','Cherry','Corn (maize)', 'Grape','Peach','Pepper bell','Potato','Strawberry','Tomato'];

    if SelectedValue == species[0]: # Apple
        print(species[0],'locked and loaded!')
        model = load_model('Models/apple_classification_segmented_resnet50.h5', compile=False)
        target_names = ['Apple Scab', 'Apple Black Rot','Apple Cedar Rust', 'Apple Healthy']

    elif SelectedValue == species[1]: #Cherry
        print(species[1],'locked and loaded!')
        model = load_model('Models/cherry_classification_segmented_resnet50.h5', compile=False)
        target_names = ['Cherry Powdery Mildew', 'Cherry Healthy']      

    elif SelectedValue == species[2]: #Corn (maize)
        print(species[2],'locked and loaded!')
        model = load_model('Models/corn_classification_segmented_resnet50.h5', compile=False)
        target_names = ['Corn(maize) Cercospora leaf spot(Gray leaf spot)', 'Corn (maize) Common Rust','Corn(maize) healthy', 'Corn(maize) Northern Leaf Blight']

    elif SelectedValue == species[3]: #Grape
        print(species[3],'locked and loaded!')
        model = load_model('Models/plant_classification_segmented_resnet50_grapes.h5', compile=False)
        target_names = ['Grape Black Rot', 'Grape Esca(Black_Measles)', 'Grape Leaf blight(Isariopsis_Leaf_Spot)', 'Grape Healthy']

    elif SelectedValue == species[4]: #Peach
        print(species[4],'locked and loaded!')
        model = load_model('Models/plant_classification_peach_segmented.h5', compile=False)
        target_names = ['Peach Bacterial Spot', 'Peach Healthy']    

    elif SelectedValue == species[5]: #Pepper bell
        print(species[5],'locked and loaded!')
        model = load_model('Models/plant_classification_pepper_bell_segmented.h5', compile=False)
        target_names = ['Pepper Bell Bacterial Spot','Pepper Bell Healthy']

    elif SelectedValue == species[6]: #Potato
        print(species[6],'locked and loaded!')
        model = load_model('Models/plant_classification_potato_segmented.h5', compile=False)
        target_names = ['Potato Early Blight','Potato Late Blight', 'Potato Healthy']

    elif SelectedValue == species[7]: #Strawberry
        print(species[7],'locked and loaded!')
        model = load_model('Models/plant_classification_strawberry_segmented.h5', compile=False)
        target_names = ['Strawberry Healthy', 'Strawberry Leaf Scorch']

    elif SelectedValue == species[8]: #Tomato
        print(species[8],'locked and loaded!')
        model = load_model('Models/plant_classification_segmented_resnet50_Tomato.h5', compile=False)
        target_names = ['Tomato Bacterial Spot', 'Tomato Early Blight', 'Tomato Healthy', 'Tomato Late Blight', 'Tomato Leaf Mold', 'Tomato Septoria leaf spot','Tomato Spider mites(Two spotted spider mite)', 'Tomato Target Spot', 'Tomato Mosaic Virus', 'Tomato Yellow Leaf Curl Virus']

    # print(np.shape(image[0]))
    image = prepare_image(image[0],(128,128,3),flag = True)
    preds = model.predict(image)
    print('preds',preds)
    max_ = np.argmax(preds)
    label = target_names[max_]
    global predictions
    predictions = {'label':label,'prob':preds[max_]}
    print("predictions",predictions)
    return predictions

wanna_load_model = 'y'

# if not lan_server == "y":
url = 'http://127.0.0.3:5001'
# else:
#     url = 'http://192.168.43.187:5000'

app = Flask(__name__)
app.secret_key='hi'

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/single_image')
def single_image():
    return Response(gen_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/segment')
def segment():
    return render_template("index.html")

@app.route('/save',methods = ['GET','POST'])
def save():
    return render_template("save.html")

@app.route('/result',methods = ['GET','POST'])
def result():
    if request.method == 'POST':        
        global predictions
        predictions = request.form.to_dict()
        print('predictions:',predictions)

        if predictions == None:
            raise Exception("can't get predictions")

        return 'OK', 200

    else:
        return jsonify(predictions) # return 

@app.route('/jsondata',methods=['GET','POST'])
def jsondata():
    if request.method == 'POST':        
        global data
        data = request.form.to_dict()
        print('data:',data)

        if data == None:
            raise Exception("can't get data")

        return 'OK', 200

    else:
        return jsonify(data) # return dic when get request 

@app.route("/predict", methods=["GET","POST"])
def predict():
    data = {}
    data["success"] = False  
    global predictions    
    if request.method == 'GET':
        return render_template('predict.html')

    elif request.method == 'POST':
        data = request.get_json()
        meta_data,image = data['image'].split(',')
        SelectedValue = data['SelectedValue']

        image = base64.b64decode(image)
        image = Image.open(io.BytesIO(image))
        image.save("static/temp_img.bmp")
        image = prepare_image(image,target_size = (224,224))

        if wanna_load_model =='y':
            predictions =  give_predictions(image,SelectedValue)

        print(predictions['label'],predictions['prob'])
        return redirect(url_for('display_results'))

@app.route('/display_results',methods=['GET','POST'])
def display_results():
    return render_template('display_results.html',label=predictions['label'],prob=predictions['prob'][0])

@app.route('/get_pred_seg',methods=['GET','POST'])
def get_pred_seg():
    img= prepare_image(ROI,target_size = (224,224))
    predictions=give_predictions(img,flag=True)
    return render_template('predict_segmented.html',label=predictions['label'],prob=predictions['prob'])

@app.route('/folders',methods = ['GET','POST'])
def folders():
    if request.method == 'POST':        
        global folders
        folders = request.get_json()
        print('folders:',folders)

        if folders == None:
            raise Exception("can't get folders")

        save_roi_at_location(folders)

        return 'OK', 200

    else:
        return jsonify(folders) 


@app.route('/pred_api',methods = ['GET','POST']) 
def pred_api():
    if request.method == 'POST':        
        global predictions
        predictions = request.get_json()

        if predictions == None:
            raise Exception("can't get predictions")

        return 'OK', 200

    else:
        return jsonify(predictions) 


@app.route('/segment_static')
def segment_static():
    pass


if __name__ == '__main__':
    # app.run(host=address,port=port,debug=debug)
    app.run(host="127.0.0.3",port="5001",debug=True)
    # app.run(host="127.0.0.3",port="5001",debug=False)

    # app.run(host="192.168.43.187",port="5000",debug=False)









# print('lan server?')
# lan_server = input('y/n')
# if lan_server == 'y' :
#     address = "0.0.0.0"
#     port = "5000"
# else:
#     address = "127.0.0.3"
#     port = "5001"



# print('debug?')
# debug = input('y/n')
# if debug == 'y' :
#     debug = True
# else:
#     debug = False




# print('do you wish to load the model?')
# wanna_load_model = input('y/n')
