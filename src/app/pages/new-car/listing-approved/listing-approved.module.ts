import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { NewListingApprovedRoutingModule } from './listing-approved-routing.module';
import { NewCarListingApprovedComponent } from './listing-approved.component';

@NgModule({
  imports: [CommonModule, TranslateModule, NewListingApprovedRoutingModule],
  declarations: [NewCarListingApprovedComponent]
})
export class ListingApprovedModule {}
