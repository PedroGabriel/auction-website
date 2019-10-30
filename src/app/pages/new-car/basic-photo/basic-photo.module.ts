import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingsService } from '@app/shared/api';

import { BasicPhotoRoutingModule } from './basic-photo-routing.module';
import { NewCarBasicPhotoComponent } from './basic-photo.component';
import {  CriaturoDndModule } from '../../../criaturo/criaturo-dnd.module';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, BasicPhotoRoutingModule, CriaturoDndModule  ],
  declarations: [NewCarBasicPhotoComponent],
  providers: [ListingsService]
})
export class BasicPhotoModule {}
