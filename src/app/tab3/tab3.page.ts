import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/services/http-service.service';
import { apiURL } from 'src/app/models/api';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {LoadingService} from 'src/app/services/loading-service/loading-service.service';
import { Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/services/commonFunctions/common-functions.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
// import {QRCodeComponent} from 'ng2-qrcode';
import { ModalController } from '@ionic/angular';
import { ModalExampleComponent } from './modal-example.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  driver_id = localStorage.getItem('driver_id');
  iot_token = localStorage.getItem('iot_token');
  notificationData = [];
  userObject :any;
  encodeData: any;
  showQr = false;
  title = 'qr-code-demo';
  qrValue = '';
    size = 400;
    centerImageSrc = 'https://zorukcdn.s3.amazonaws.com/logo-square.png';
    centerImageSize = 50;
  constructor(
    private httpService: HttpRequestService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public loading: LoadingService,
    private router: Router,
    public commonFunc: CommonFunctionsService,
    private callNumber: CallNumber,
    private barcodeScanner: BarcodeScanner,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
this.userObject = JSON.parse(localStorage.getItem('userObj'));
    this.qrValue = this.userObject.qr_id;
    // this.showQr = true;
  }

  logout() {
    this.loading.present();
    localStorage.clear();
    this.loading.dismiss();
    this.router.navigate(['/login'])
  }
  callnow(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  
  // modal code
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;


  async openModal(index) {
    
    const modal = await this.modalCtrl.create({
      component: ModalExampleComponent,
      componentProps: { type: index }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }
}

