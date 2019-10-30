import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarListingApprovedComponent } from './listing-approved.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/listing-approved',
      component: NewCarListingApprovedComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Listing Approved') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NewListingApprovedRoutingModule {}
