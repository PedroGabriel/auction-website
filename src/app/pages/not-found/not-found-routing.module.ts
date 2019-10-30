import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'not-found',
      component: NotFoundComponent,
      data: { title: extract('NotFound') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NotFoundRoutingModule {}
