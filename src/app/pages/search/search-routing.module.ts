import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { SearchComponent } from './search.component';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'search',
      component: SearchComponent,
      data: { title: extract('Search') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SearchRoutingModule {}
