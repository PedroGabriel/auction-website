import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { UserPaymentComponent } from './user-payment.component';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'user-payment',
      component: UserPaymentComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Payment options') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserPaymentRoutingModule {}
