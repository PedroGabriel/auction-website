import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, FaqRoutingModule,
    FormsModule, 
    ReactiveFormsModule],
  declarations: [FaqComponent]
})
export class FaqModule {}
