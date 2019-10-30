import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { NewCarInspectionRoutingModule } from './inspection-routing.module';
import { NewCarInspectionComponent } from './inspection.component';

@NgModule({
  imports: [CommonModule, TranslateModule, NewCarInspectionRoutingModule],
  declarations: [NewCarInspectionComponent]
})
export class InspectionModule {}
