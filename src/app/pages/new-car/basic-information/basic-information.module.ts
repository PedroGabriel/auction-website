import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingsService, CarsService } from '@app/shared/api';
import { NgxTypeaheadModule } from 'ngx-typeahead';

import { BasicInformationRoutingModule } from './basic-information-routing.module';
import { NewCarBasicInformationComponent } from './basic-information.component';

@NgModule({
  imports: [
    CommonModule,
    NgxTypeaheadModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BasicInformationRoutingModule
  ],
  declarations: [NewCarBasicInformationComponent],
  providers: [ListingsService, CarsService]
})
export class BasicInformationModule { }
