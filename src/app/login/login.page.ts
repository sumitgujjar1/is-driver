import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-service.service';
import { apiURL } from 'src/app/models/api';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {LoadingService} from 'src/app/services/loading-service/loading-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginObject:any ={};
  showOtp:boolean = false;
  otpToken= '';
  constructor(
    private httpService: HttpRequestService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public loading: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }
  logForm() {
    console.log(this.loginObject);
    this.loading.present();
    if(this.loginObject.mobile_no != '') {
      this.httpService.request(apiURL['login'].otp,this.loginObject).subscribe(
        (response : any )=> {
          this.loading.dismiss();
          if(response['success'] === true){
            this.presentAlert('OTP Sent',response.msg);
            this.showOtp =true;
            this.otpToken = response.otpToken;
            this.loading.dismiss();
          } else {
            this.presentAlert('गलत सुचना',response.msg);
          }  
        }
      )
    } else {
      alert("कृपया मोबाइल नंबर दर्ज करें");
      this.loading.dismiss();
    }
  }

  verifyOtp() {
    console.log(this.loginObject);
    this.loading.present();
    this.loginObject.otpToken = this.otpToken;
    if(this.loginObject.password != '') {
      this.httpService.request(apiURL['login'].verifyOtp,this.loginObject).subscribe(
        (response : any )=> {
          this.loading.dismiss();
          console.log("Res",response);
          if(response['success'] === true){
            localStorage.setItem('loginStatus','1');
            localStorage.setItem('userObj',JSON.stringify(response['data']));
           localStorage.setItem('driver_id',response['data'].id);
            this.router.navigate(['/tabs/tab1']);
          } else {
            this.presentAlert('गलत सुचना',response.msg);
          }  
        }
      )
    } else {
      alert("कृपया OTP नंबर दर्ज करें");
      this.loading.dismiss();
    }
  }

  async presentAlert(heading,msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: heading,
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
