import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingsService } from '@app/shared/api';
import { DndModule } from '@beyerleinf/ngx-dnd';

import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';

import { CriaturoDndModule } from '../../../../criaturo/criaturo-dnd.module';
import { AdminEditListingRoutingModule } from './edit-listing-routing.module';
import { AdminEditListingComponent } from './edit-listing.component';
import { NgxTypeaheadModule } from '../../../../../../node_modules/ngx-typeahead';
import { EditorModule } from '../../../../../../node_modules/@tinymce/tinymce-angular';

@NgModule({
  imports: [
    CommonModule,
    CriaturoDndModule,
    TranslateModule,
    NgxTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    AdminEditListingRoutingModule,
    GalleryModule,
    LightboxModule,
    DndModule,
    EditorModule
  ],
  declarations: [AdminEditListingComponent],
  providers: [ListingsService]
})
export class AdminEditListingModule { }
