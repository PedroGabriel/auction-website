import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { CommentsRoutingModule } from './comments-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsComponent } from '@app/pages/admin/pages/comments/comments.component';

@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MomentModule,
    CommentsRoutingModule
  ]
})
export class CommentsModule { }
