import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService, BidsService, ListingsService } from '@app/shared/api';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, UserProfileRoutingModule, MomentModule, NgbModule],
  declarations: [UserProfileComponent],
  providers: [UsersService, BidsService, ListingsService]
})
export class UserProfileModule {}
