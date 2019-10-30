import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UsersService } from '@app/shared/api';

import { YourListingRoutingModule } from './your-listing-routing.module';
import { NewCarYourListingComponent } from './your-listing.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, TranslateModule, YourListingRoutingModule, NgbDropdownModule],
  declarations: [NewCarYourListingComponent],
  providers: [UsersService]
})
export class YourListingModule {}
