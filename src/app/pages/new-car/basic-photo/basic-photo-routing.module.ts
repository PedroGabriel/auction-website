import { NgModule } from '@angular/core';
import { AuthenticationGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { NewCarBasicPhotoComponent } from './basic-photo.component';
import { Template } from '@app/pages/template/template.service'; 

const routes: Routes = [
  Template.childRoutes([
    {
      path: 'new-car/basic-photo/:listing',
      component: NewCarBasicPhotoComponent, 
      canActivate: [AuthenticationGuard],
      data: { title: extract('Basic Photo') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BasicPhotoRoutingModule {}
