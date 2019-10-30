import { NgModule } from '@angular/core';
// import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { FaqComponent } from './faq.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'faq',
      component: FaqComponent,
      data: { title: extract('Faq') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FaqRoutingModule {}
