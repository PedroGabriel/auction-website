import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DndModule} from '@beyerleinf/ngx-dnd';
import { GalleryRoutingModule } from './gallery-routing.module';
import { NewCarGalleryComponent } from './gallery.component';
import {  CriaturoDndModule } from '../../../criaturo/criaturo-dnd.module';

@NgModule({
  imports: [CommonModule, TranslateModule, GalleryRoutingModule, CriaturoDndModule, NgbModule, DndModule],
  declarations: [NewCarGalleryComponent]
})
export class NewCarGalleryModule {}
