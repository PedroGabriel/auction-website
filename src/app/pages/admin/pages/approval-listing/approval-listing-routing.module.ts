import { NgModule } from '@angular/core';
// import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AdminApprovalListingComponent } from './approval-listing.component';
import { Admin } from '@app/pages/admin/admin.service';

const routes: Routes = [
  Admin.childRoutes([
    {
      path: 'approval-listing',
      component: AdminApprovalListingComponent,
      data: { title: extract('AdminApprovalListing') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminApprovalListingRoutingModule {}
