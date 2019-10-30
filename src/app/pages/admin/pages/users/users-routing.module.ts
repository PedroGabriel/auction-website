import { NgModule } from '@angular/core';
// import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AdminUsersComponent } from './users.component';
import { Admin } from '@app/pages/admin/admin.service';

const routes: Routes = [
  Admin.childRoutes([
    {
      path: 'users',
      component: AdminUsersComponent,
      data: { title: extract('AdminUsers') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminUsersRoutingModule {}
