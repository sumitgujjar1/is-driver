import { Component  } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-service.service';
import { apiURL } from 'src/app/models/api';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {LoadingService} from 'src/app/services/loading-service/loading-service.service';
import { Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/services/commonFunctions/common-functions.service';

import { ModalController } from '@ionic/angular';
import { MapviewPage } from '../mapview/mapview.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  driver_id = localStorage.getItem('driver_id');
  iot_token = localStorage.getItem('iot_token');
  transactionData = [];
  iotData:{
    soc,b_sno,bvol,tmax
  };
  userObj:any;
  showData = false;
  weekSwaps = 0;
  wallet_bal = 0;
  constructor(
    private httpService: HttpRequestService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public loading: LoadingService,
    private router: Router,
    public commonFunc: CommonFunctionsService,
    private modalCtrl: ModalController
  ) {

  }
ngOnInit() {
    this.getDashData(this.driver_id);
    this.userObj = JSON.parse(localStorage.getItem('userObj'));
    
  }

  getDashData(driver_id) {
    this.loading.present();
    let body = {
      driver_id:driver_id,
      
    }
    this.httpService.request(apiURL['reports'],body).subscribe(
      (response : any )=> {
        this.loading.dismiss();
        console.log(response['data']);
        if(response['success'] === true){
          this.transactionData = response['data'].transactions;
          this.weekSwaps = response['data'].week_swaps;
          this.showData = true;
        } else {
          
        }  
      }
    )
  }
}
