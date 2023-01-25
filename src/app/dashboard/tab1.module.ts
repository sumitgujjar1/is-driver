import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NaFilterPipe } from '../pipes/naFilter/na-filter.pipe';
import { MomentModule } from 'ngx-moment';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ExploreContainerComponentModule,
    MomentModule,
    Tab1PageRoutingModule
  ],
  providers: [
    Geolocation
  ],
  declarations: [Tab1Page,NaFilterPipe]
})
export class Tab1PageModule {}
