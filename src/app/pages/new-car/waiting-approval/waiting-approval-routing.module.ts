import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarWaitingApprovalComponent } from './waiting-approval.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/waiting-approval/:listing',
      component: NewCarWaitingApprovalComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Waiting Approval') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class WaitingApprovalRoutingModule {}
