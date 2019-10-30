import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarWaitingApprovalFinalComponent } from './waiting-approval-final.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/waiting-approval-final/:listing',
      component: NewCarWaitingApprovalFinalComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Waiting Approval Final') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class WaitingApprovalFinalRoutingModule {}
