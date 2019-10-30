import { NgModule } from '@angular/core';
// import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AdminUserDetailComponent } from './user-detail.component';
import { Admin } from '@app/pages/admin/admin.service';

const routes: Routes = [
  Admin.childRoutes([
    {
      path: 'user-detail/:userId',
      component: AdminUserDetailComponent,
      data: { title: extract('AdminUserDetail') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminUserDetailRoutingModule {}
