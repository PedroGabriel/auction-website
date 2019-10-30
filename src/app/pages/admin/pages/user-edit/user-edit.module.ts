import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminUserEditRoutingModule } from './user-edit-routing.module';
import { AdminUserEditComponent } from './user-edit.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, AdminUserEditRoutingModule],
  declarations: [AdminUserEditComponent]
})
export class AdminUserEditModule {}
