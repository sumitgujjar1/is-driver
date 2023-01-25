import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapviewPageRoutingModule } from './mapview-routing.module';

import { MapviewPage } from './mapview.page';

import { GoogleMapsModule } from '@angular/google-maps'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapviewPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [MapviewPage]
})
export class MapviewPageModule {}
