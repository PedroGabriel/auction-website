import { NgModule } from '@angular/core';
// import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AdminUserEditComponent } from './user-edit.component';
import { Admin } from '@app/pages/admin/admin.service';

const routes: Routes = [
  Admin.childRoutes([
    {
      path: 'user-edit/:userId',
      component: AdminUserEditComponent,
      data: { title: extract('AdminUserEdit') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminUserEditRoutingModule {}
