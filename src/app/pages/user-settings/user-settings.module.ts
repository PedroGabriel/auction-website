import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, UserSettingsRoutingModule],
  declarations: [UserSettingsComponent]
})
export class UserSettingsModule {}
