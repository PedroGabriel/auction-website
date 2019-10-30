import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SeeAllRoutingModule } from './see-all-routing.module';
import { SeeAllComponent } from './see-all.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SeeAllRoutingModule],
  declarations: [SeeAllComponent]
})
export class SeeAllModule {}
