import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyComponent } from './privacy.component';

@NgModule({
  imports: [CommonModule, TranslateModule, PrivacyRoutingModule],
  declarations: [PrivacyComponent]
})
export class PrivacyModule {}
