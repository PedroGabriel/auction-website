import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AdminManageListingsComponent } from './manage-listings.component';
import { Admin } from '@app/pages/admin/admin.service';

const routes: Routes = [
  Admin.childRoutes([
    {
      path: '',
      component: AdminManageListingsComponent,
      data: { title: extract('Manage Listings') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminManageListingsRoutingModule {}
