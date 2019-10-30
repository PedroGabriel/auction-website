import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarReviewSubmitComponent } from './review-submit.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/review-submit/:listing',
      component: NewCarReviewSubmitComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Review Submit') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ReviewSubmitRoutingModule {}
