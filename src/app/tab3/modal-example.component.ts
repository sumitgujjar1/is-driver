import { Component,Input } from '@angular/core';

import { ModalController } from '@ionic/angular';
// import { apiURL } from '../../models/api';
// import { HttpRequestService } from '../../services/http-request/http-request.service'
 
@Component({
  selector: 'app-modal-example',
  templateUrl: 'modal-example.component.html',
})
export class ModalExampleComponent {
  name: string;
  showLoader: boolean = false;
  
  @Input("type") type;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.type);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}