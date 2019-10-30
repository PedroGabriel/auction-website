import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableModule } from 'ng-contenteditable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AboutRoutingModule } from './about-routing.module';
import { PagesService } from '@app/shared/api';
import { AboutComponent } from './about.component';

@NgModule({
  imports: [CommonModule, TranslateModule, AboutRoutingModule,
    ContenteditableModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [AboutComponent],
  providers: [PagesService]
})
export class AboutModule { }
