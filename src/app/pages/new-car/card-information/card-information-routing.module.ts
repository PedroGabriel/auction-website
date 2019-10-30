import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarCardInformationComponent } from './card-information.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/card-information/:listing',
      component: NewCarCardInformationComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Card Information') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CardInformationRoutingModule {}
