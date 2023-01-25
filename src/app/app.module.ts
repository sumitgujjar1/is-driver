import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MomentModule } from 'ngx-moment';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { ModalExampleComponent } from './tab3/modal-example.component';

@NgModule({
  declarations: [AppComponent,ModalExampleComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,IonicModule,MomentModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    NativeGeocoder,
    CallNumber,
    BarcodeScanner,
    FirebaseX
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
