import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { BidDetailComponent } from './bid-detail.component';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'bid-detail/:listing',
      component: BidDetailComponent,
      data: { title: extract('Bid Detail') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BidDetailRoutingModule {}
