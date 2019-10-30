import { NgModule } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SlickModule } from 'ngx-slick';
import { CountdownModule } from 'ngx-countdown';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '@app/core';
import { DateService } from '@app/shared/date.service';
import { ListingsService, CarsService } from '@app/shared/api';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CriaturoDndModule } from '../../criaturo/criaturo-dnd.module';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SlickModule,
    CoreModule,
    HomeRoutingModule,
    CountdownModule,
    FormsModule,
    CriaturoDndModule
  ],
  declarations: [HomeComponent],
  providers: [ListingsService, DateService, CarsService]
})
export class HomeModule { }
