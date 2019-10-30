import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReviewSubmitRoutingModule } from './review-submit-routing.module';
import { NewCarReviewSubmitComponent } from './review-submit.component';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { DndModule } from '@beyerleinf/ngx-dnd';
import { CriaturoDndModule } from '@app/criaturo/criaturo-dnd.module';
import { EditorModule } from '../../../../../node_modules/@tinymce/tinymce-angular';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTypeaheadModule,
    ReviewSubmitRoutingModule,
    GalleryModule,
    LightboxModule,
    CriaturoDndModule,
    DndModule,
    EditorModule
  ],
  declarations: [NewCarReviewSubmitComponent]
})
export class ReviewSubmitModule { }
