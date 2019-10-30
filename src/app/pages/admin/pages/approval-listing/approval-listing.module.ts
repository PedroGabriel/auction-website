import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AdminApprovalListingRoutingModule } from './approval-listing-routing.module';
import { AdminApprovalListingComponent } from './approval-listing.component';

@NgModule({
  imports: [CommonModule, TranslateModule, AdminApprovalListingRoutingModule],
  declarations: [AdminApprovalListingComponent]
})
export class AdminApprovalListingModule {}
