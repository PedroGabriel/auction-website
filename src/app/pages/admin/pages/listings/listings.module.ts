import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownModule } from 'ngx-countdown';
import { TranslateModule } from '@ngx-translate/core';
import { SlickModule } from 'ngx-slick';

import { AdminListingsRoutingModule } from './listings-routing.module';
import { AdminListingsComponent } from './listings.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SlickModule, AdminListingsRoutingModule, CountdownModule],
  declarations: [AdminListingsComponent]
})
export class AdminListingsModule {}
