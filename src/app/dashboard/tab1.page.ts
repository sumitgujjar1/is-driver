/* eslint-disable prefer-const */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component,Injectable  } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-service.service';
import { apiURL } from 'src/app/models/api';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {LoadingService} from 'src/app/services/loading-service/loading-service.service';
import { Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/services/commonFunctions/common-functions.service';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { ModalController } from '@ionic/angular';
import { MapviewPage } from '../mapview/mapview.page';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LocalStorageService } from '../services/user-info/user-info.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  driver_id: string;
  transactionData:any [];
  stationsData:any [];
  iotData:any = {};
  userObj:any;
  showData = false;
  wallet_bal = 0;
  today_swaps = 0;
  constructor(
    private localStorageService: LocalStorageService,
    private httpService: HttpRequestService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public loading: LoadingService,
    private router: Router,
    public commonFunc: CommonFunctionsService,
    private modalCtrl: ModalController,
    private platform: Platform,
    private firebaseX: FirebaseX,
    private geolocation: Geolocation
  ) {
    this.driver_id = this.localStorageService.getDriverId();
    this.userObj = this.localStorageService.getUserObject();
  }
async ngOnInit() {
    this.getDashData(this.driver_id);
    // this.userObj = JSON.parse(localStorage.getItem('userObj'));
    this.platform.ready().then((data) => {

      this.geolocation.getCurrentPosition().then((resp) => {
        let dataObj = {
          city_id:this.userObj.city_id,
          user_lat:resp.coords.latitude,
          user_long:resp.coords.longitude
         }
         this.getStations(dataObj);
       }).catch((error) => {
         console.log('Error getting location', error);
         console.log("city_id",this.userObj.city_id);
         let dataObj = {
          city_id:this.userObj.city_id,
          user_lat:0,
          user_long:0
         }
         this.getStations(dataObj);
       });

      this.firebaseX.getToken()
     .then(token => {
       console.log(`The token is `)
       this.updateToken(token);
     }
       ) // save the token server-side and use it to push notifications to this device
     .catch(error => console.error('Error getting token', error));
   
       });

  }
  doRefresh(event) {
    this.getDashData(this.driver_id);
    this.userObj = JSON.parse(localStorage.getItem('userObj'));
    event.target.complete();
  }

  
  getDashData(driver_id) {
    let body = {
      driver_id: driver_id,
    }
    this.httpService.request(apiURL['dashboard'].dash,body).subscribe(
      (response : any )=> {
        console.log(response['data']);
        if(response['success'] === true){
          this.transactionData = response['data'].transactions;
          this.wallet_bal = response['data'].wallet_bal;
          this.today_swaps = response['data'].today_swaps;
          this.iotData = response['iotData'];
          this.showData = true;
        } else {
          
        }  
      }
    )
  }
  

  async OpenModel(lat,long){
    const presentModel = await this.modalCtrl.create({
      component: MapviewPage,
      componentProps: {
        user_lat:lat,
        long:long
      },
      showBackdrop: true,
      mode:	"ios",
      cssClass: 'change-address-shipping-modal'
    });

    presentModel.onWillDismiss().then((data)=>{
      console.log(data);
      //custom code
    });
    
    return await presentModel.present();
  }
  // update FCM Token 

  updateToken(token) {
    var payload = {
      fcm_token: token,
      driver_id:this.driver_id,
    };
    console.log("payload",payload);

    // this.router.navigateByUrl('/swap' , {state : {station_id: null , data: payload }});

    this.httpService.request(apiURL['fcmUpdate'], payload).subscribe((response: any) => {
      console.log(response.data);
    });
  }

  getStations(dataObj) {
    this.loading.present();
    dataObj.driver_id = this.driver_id;
    this.httpService.request(apiURL['dashboard'].stations,dataObj).subscribe(
      (response : any )=> {
        this.loading.dismiss();
        console.log(response['data']);
        if(response['success'] === true){
          this.stationsData = response['data'];
        } else {
          
        }  
      }
    )
  }
  navigate(latitude, longitude) {
    let destination = latitude + ',' + longitude;

if(this.platform.is('ios')){
	window.open('maps://?q=' + destination, '_system');
} else {
	let label = encodeURI('My Label');
	window.open('geo:0,0?q=' + destination + '_system');
}
  }
}
