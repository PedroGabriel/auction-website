import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarRecordsComponent } from './records.component';
import { Template } from '@app/pages/template/template.service';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/records/:listing',
      component: NewCarRecordsComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Records') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NewCarRecordsRoutingModule {}
