import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserPaymentRoutingModule } from './user-payment-routing.module';
import { UserPaymentComponent } from './user-payment.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, UserPaymentRoutingModule],
  declarations: [UserPaymentComponent]
})
export class UserPaymentModule {}
