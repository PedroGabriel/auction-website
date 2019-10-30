import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminUsersRoutingModule } from './users-routing.module';
import { AdminUsersComponent } from './users.component';

import { UsersService } from '@app/shared/api';

@NgModule({
  imports: [CommonModule, TranslateModule, AdminUsersRoutingModule, NgbModule, RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [AdminUsersComponent],
  providers: [UsersService]
})
export class AdminUsersModule {}
