import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-service.service';
import { apiURL } from 'src/app/models/api';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from '../services/user-info/user-info.service';
import { LoadingController } from '@ionic/angular';
import {LoadingService} from 'src/app/services/loading-service/loading-service.service';

declare var RazorpayCheckout:any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  userObject:any;
  user_name ='';
  loaderData: string = "Loading Data";
  showLoader: boolean = false;
  all_transactions:any = [];
  wallet_sum:any ={};
  constructor(
    private httpService: HttpRequestService,
    public alertController: AlertController,
    private localStorageService: LocalStorageService,
    public loadingController: LoadingController,
    public loading: LoadingService,

  ) { 
    this.userObject = JSON.parse(localStorageService.getUserObject());
  }

  ngOnInit() {
    this.getData();
  }
  getData() {
    let payload = {
      qr_id:this.userObject.qr_id,
      user_id:this.userObject.id
    };
    console.log(this.userObject)
       this.loading.present();
        this.httpService.request(apiURL['wallet'].dash,payload).subscribe(
          (response : any )=> {
            if(response.success) {
            console.log(response);
            this.loading.dismiss();
            this.all_transactions = response.transactions;
            this.wallet_sum = response.data;
              }
            }
          )
        }
        
  async createOrderRazorpay(amount) {
       this.loading.present();
    let dataObj = {
      user_id:this.userObject.id,
      qr_id:this.userObject.qr_id,
      amount:amount,
      user_object:this.userObject,
      type:'driver'
    };

    this.httpService.request(apiURL['wallet'].create,dataObj).subscribe(
      (response : any )=> {
        this.loading.dismiss();
        if(response.success) {
         console.log(response);
          this.Razorpay(response);
          }
        }
      );

    
  }

  async Razorpay(body) {
    var options = {
      order_id: body.id,
      name: 'Instaswap',
      image: 'https://instaswap.in/assets/img/favicon.png',
      prefill: {
        name: body.userObject.name,
        contact: body.userObject.mobile_no,
        email: body.userObject.email,
        language: 'hn',
        method: 'upi'
      },
      modal: {
        ondismiss: function () {
          console.log('dismissed') 
        }
      }
    };

    var successCallback = (payment_id) => {
      console.log('payment_id: ', payment_id);
      this.updatePayment(payment_id, body.id);
    };

    var cancelCallback = async (error) => {
      console.log("error",error);
      if (confirm("Are you sure to Cancel Payment?") == true) {
         this.updatePayment('',body.id)
      } else {
        
      }
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  async updatePayment(payment_id, order_id) {
       this.loading.present();
    let dataObj = {
      payment_id: payment_id,
      order_id: order_id,
      qr_id:this.userObject.qr_id,
      user_id:this.userObject.id,
      type:'driver'
    }
    this.httpService.request(apiURL['wallet'].verify, dataObj).subscribe(
      (response: any) => {
        this.loading.dismiss();
        console.log("response")
        if (response.success) {
          console.log(response);
          alert("धन्यवाद !! भुगतान हो गया!!");
          this.getData();          
        } else {
          console.log(response);
        }
      }
    );
  }
 
  doRefresh(event) {
    console.log("event",event)
    this.getData();
    event.target.complete();
    
      }

  async presentAlertPrompt(type) {
    const alert = await this.alertController.create({
      header: 'कृपया जमा करने के लिए राशि दर्ज करें',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'ex. ₹10.00'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (index) => {
            console.log('Confirm Ok',index.driver_id);
            if(index.amount > 0) {
              this.createOrderRazorpay(index.amount);
            } 
           
          }
        }
      ]
    });

    await alert.present();
  }

}
