import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-service.service';
import { apiURL } from 'src/app/models/api';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {LoadingService} from 'src/app/services/loading-service/loading-service.service';
import { Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/services/commonFunctions/common-functions.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  driver_id = localStorage.getItem('driver_id');
  iot_token = localStorage.getItem('iot_token');
  notificationData = [];
  constructor(
    private httpService: HttpRequestService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public loading: LoadingService,
    private router: Router,
    public commonFunc: CommonFunctionsService,
  ) { }

  ngOnInit() {
    this.getnotifications(this.driver_id);
  }
  
  getnotifications(driver_id) {
    this.loading.present();
    let body = {
      driver_id:driver_id,
    }
    this.httpService.request(apiURL['notifications'],body).subscribe(
      (response : any )=> {
        this.loading.dismiss();
        console.log(response['data']);
        if(response['success'] === true){
          this.notificationData = response['data'].notifications;
        } else {
          
        }  
      }
    )
  }
}
