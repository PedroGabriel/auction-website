import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Admin } from '@app/pages/admin/admin.service';
import { CommentsComponent } from '@app/pages/admin/pages/comments/comments.component';
import { extract } from '@app/core';

const routes: Routes = [
  Admin.childRoutes([
    {
      path: 'comments',
      component: CommentsComponent,
      data: { title: extract('Comments') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentsRoutingModule { }
