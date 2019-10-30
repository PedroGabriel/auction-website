import { NgModule } from '@angular/core';
// import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ReviewComponent } from './review.component';
import { Template } from '@app/pages/template/template.service';
import { AuthenticationGuard } from '@app/core';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'review/:listingId',
      component: ReviewComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Review'), HideSearch: false }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ReviewRoutingModule {}
