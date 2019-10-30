import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService, BidsService, ListingsService } from '@app/shared/api';

import { AdminUserDetailRoutingModule } from './user-detail-routing.module';
import { AdminUserDetailComponent } from './user-detail.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, AdminUserDetailRoutingModule, MomentModule],
  declarations: [AdminUserDetailComponent],
  providers: [UsersService, BidsService, ListingsService]
})
export class AdminUserDetailModule {}
