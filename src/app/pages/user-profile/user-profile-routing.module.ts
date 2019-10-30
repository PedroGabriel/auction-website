import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { UserProfileComponent } from './user-profile.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  Template.childRoutes([
    {
      path: 'user-profile',
      component: UserProfileComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('UserProfile') }
    },
    {
      path: 'user-profile/:userId',
      component: UserProfileComponent, 
      data: { title: extract('UserProfile') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgbModule],
  exports: [RouterModule],
  providers: []
})
export class UserProfileRoutingModule {}
