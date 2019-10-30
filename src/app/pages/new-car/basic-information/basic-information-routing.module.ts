import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarBasicInformationComponent } from './basic-information.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/basic-information',
      component: NewCarBasicInformationComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Basic Information') }
    },
    {
      path: 'new-car/basic-information/:listing',
      component: NewCarBasicInformationComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Basic Information') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BasicInformationRoutingModule {}
