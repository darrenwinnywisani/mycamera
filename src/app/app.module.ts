import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera'
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Flashlight } from '@ionic-native/flashlight';
import { MediaCapture } from '@ionic-native/media-capture'
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
@NgModule({
  declarations: [
    MyApp,
    HomePage
  
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Flashlight,
    Camera,
    Media,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},MediaCapture
  ]
})
export class AppModule {}
