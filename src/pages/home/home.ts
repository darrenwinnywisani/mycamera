import { Component,ViewChild } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Flashlight } from '@ionic-native/flashlight';
import { MediaCapture, MediaFile, CaptureError,  CaptureVideoOptions } from '@ionic-native/media-capture';
import { Storage } from '@ionic/storage';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
const MEDIA_FILES_KEY = 'mediaFiles';
@Component({
selector: 'page-home',
templateUrl: 'home.html'
})
export class HomePage {
  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  isOn:boolean=false;
public photos : any;
public base64Image : string;

constructor(public navCtrl: NavController,private camera: Camera,private alertCtrl : AlertController,private flashlight: Flashlight,private mediaCapture: MediaCapture, private storage: Storage, private file: File, private media: Media) {}
ngOnInit() {
  this.photos = [];
}



takePhoto(){
  const options : CameraOptions = {
    quality: 50, // picture quality
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  this.camera.getPicture(options) .then((imageData) => {
    this.base64Image = "data:image/jpeg;base64," + imageData;
    this.photos.push(this.base64Image);
    this.photos.reverse();
  }, (err) => {
    console.log(err);
  });
}
deletePhoto(index) {
this.photos.splice(index, 1);
let confirm =this.alertCtrl.create({
title: 'Sure you want to delete this photo?',
message:'',
buttons:[
  {
    text: 'No',
    handler: () => {
      console.log('Disagree clicked');
    }
  },{
    text: 'Yes',
    handler: () =>{
      console.log('Agree clicked');
          this.photos.splice(index, 1);
    }
  }
]
});
confirm.present();
}

Gallery(){
const options : CameraOptions = {
  quality: 100, // picture quality
  destinationType: this.camera.DestinationType.DATA_URL,
  sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
  correctOrientation:true,
  saveToPhotoAlbum:true
}
this.camera.getPicture(options) .then((imageData) => {
  this.base64Image = "data:image/jpeg;base64," + imageData;
  this.photos.push(this.base64Image);
  this.photos.reverse();
}, (err) => {
  console.log(err);
});
}
async isAvailable():Promise<boolean>{
  try{
    
    return await this.flashlight.available();
  }
  catch(e){
    console.log(e);
  }
}
async toggleFlash():Promise<void>{
  try{
    let available=await this.isAvailable();
    if(available){
      await this.flashlight.toggle();
      this.isOn=!this.isOn;

    }
    else{
      console.log("Isn`t available");
    }
  }
  catch(e){
    console.log(e);
  }
}
async turnOnFlash():Promise<void>{
  await this.flashlight.switchOn();
}
async turnOffFlash():Promise<void>{
  await this.flashlight.switchOff();
}

async isOnFlash():Promise<boolean>{
 return await this.flashlight.switchOn();
}
ionViewDidLoad() {
  this.storage.get(MEDIA_FILES_KEY).then(res => {
    this.mediaFiles = JSON.parse(res) || [];
  })
}

captureAudio() {
  this.mediaCapture.captureAudio().then(res => {
    this.storeMediaFiles(res);
  }, (err: CaptureError) => console.error(err));
}

captureVideo() {
  let options: CaptureVideoOptions = {
    limit: 1,
    duration: 30
  }
  this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
    let capturedFile = res[0];
    let fileName = capturedFile.name;
    let dir = capturedFile['localURL'].split('/');
    dir.pop();
    let fromDirectory = dir.join('/');      
    var toDirectory = this.file.dataDirectory;
    
    this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
      this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
    },err => {
      console.log('err: ', err);
    });
        },
  (err: CaptureError) => console.error(err));
}

play(myFile) {
  if (myFile.name.indexOf('.wav') > -1) {
    const audioFile: MediaObject = this.media.create(myFile.localURL);
    audioFile.play();
  } else {
    let path = this.file.dataDirectory + myFile.name;
    let url = path.replace(/^file:\/\//, '');
    let video = this.myVideo.nativeElement;
    video.src = url;
    video.play();
  }
}

storeMediaFiles(files) {
  this.storage.get(MEDIA_FILES_KEY).then(res => {
    if (res) {
      let arr = JSON.parse(res);
      arr = arr.concat(files);
      this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
    } else {
      this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
    }
    this.mediaFiles = this.mediaFiles.concat(files);
  })
}
}
