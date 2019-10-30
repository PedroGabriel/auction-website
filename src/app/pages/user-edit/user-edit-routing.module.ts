import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { UserEditComponent } from './user-edit.component';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'user-edit',
      component: UserEditComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('UserEdit') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserEditRoutingModule {}
