import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionComponent } from './inspection.component';
import { CriaturoDndModule } from '@app/criaturo/criaturo-dnd.module';

@NgModule({
  imports: [CommonModule, TranslateModule, InspectionRoutingModule, CriaturoDndModule],
  declarations: [InspectionComponent]
})
export class InspectionModule { }
