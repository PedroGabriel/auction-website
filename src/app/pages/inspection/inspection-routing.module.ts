import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Template } from '@app/pages/template/template.service';
import { InspectionComponent } from '@app/pages/inspection/inspection.component';

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'inspection/:listing',
      component: InspectionComponent,
      canActivate: [AuthenticationGuard],
      data: { title: extract('Inspection') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InspectionRoutingModule {}
