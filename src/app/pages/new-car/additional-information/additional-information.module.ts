import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingsService } from '@app/shared/api';

import { AdditionalInformationRoutingModule } from './additional-information-routing.module';
import { NewCarAdditionalInformationComponent } from './additional-information.component';

import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, AdditionalInformationRoutingModule, EditorModule],
  declarations: [NewCarAdditionalInformationComponent],
  providers: [ListingsService]
})
export class AdditionalInformationModule {}
