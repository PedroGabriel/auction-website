import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { ListingsService } from '@app/shared/api';

import { AdminManageListingsRoutingModule } from './manage-listings-routing.module';
import { AdminManageListingsComponent } from './manage-listings.component';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, AdminManageListingsRoutingModule],
  declarations: [AdminManageListingsComponent],
  providers: [ListingsService]
})
export class AdminManageListingsModule {}
