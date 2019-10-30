import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';

@NgModule({
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, ReviewRoutingModule, MomentModule, FormsModule],
  declarations: [ReviewComponent]
})
export class ReviewModule {}
