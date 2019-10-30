import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsService } from '@app/shared/api';

import { CardInformationRoutingModule } from './card-information-routing.module';
import { NewCarCardInformationComponent } from './card-information.component';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CardInformationRoutingModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [NewCarCardInformationComponent],
  providers: [PaymentsService]
})
export class CardInformationModule { }
