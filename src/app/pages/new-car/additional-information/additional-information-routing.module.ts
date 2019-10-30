import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarAdditionalInformationComponent } from './additional-information.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/additional-information/:listing',
      component: NewCarAdditionalInformationComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Additional Information') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdditionalInformationRoutingModule {}
