import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingsService } from '@app/shared/api';

import { TranslateModule } from '@ngx-translate/core';

import { NewCarRecordsRoutingModule } from './records-routing.module';
import { NewCarRecordsComponent } from './records.component';
import {  CriaturoDndModule } from '../../../criaturo/criaturo-dnd.module';

@NgModule({
  imports: [CommonModule, TranslateModule, NewCarRecordsRoutingModule, CriaturoDndModule],
  declarations: [NewCarRecordsComponent],
  providers: [ListingsService]
})
export class RecordsModule {}
