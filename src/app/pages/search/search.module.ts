import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SlickModule } from 'ngx-slick';
import { MomentModule } from 'ngx-moment';
import { CountdownModule } from 'ngx-countdown';
import { NgxCurrencyModule } from 'ngx-currency';

import { ListingsService, CarsService } from '@app/shared/api';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { Ng5SliderModule } from 'ng5-slider';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import {  CriaturoDndModule } from '../../criaturo/criaturo-dnd.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SearchRoutingModule,
    CriaturoDndModule,
    FormsModule,
    ReactiveFormsModule,
    AgmJsMarkerClustererModule,
    AgmCoreModule,
    SlickModule,
    MomentModule,
    CountdownModule,
    NgxCurrencyModule,
    Ng5SliderModule,
    AgmJsMarkerClustererModule
  ],
  declarations: [SearchComponent],
  providers: [ListingsService, CarsService]
})
export class SearchModule {}
