import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingsService } from '@app/shared/api';

import { WaitingApprovalFinalRoutingModule } from './waiting-approval-final-routing.module';
import { NewCarWaitingApprovalFinalComponent } from './waiting-approval-final.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, WaitingApprovalFinalRoutingModule],
  declarations: [NewCarWaitingApprovalFinalComponent],
  providers: [ListingsService]
})
export class WaitingApprovalFinalModule {}
