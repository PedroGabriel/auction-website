import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingsService, UsersService } from '@app/shared/api';

import { WaitingApprovalRoutingModule } from './waiting-approval-routing.module';
import { NewCarWaitingApprovalComponent } from './waiting-approval.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, WaitingApprovalRoutingModule],
  declarations: [NewCarWaitingApprovalComponent]
  // providers: [ListingsService, UsersService]
})
export class WaitingApprovalModule {}
