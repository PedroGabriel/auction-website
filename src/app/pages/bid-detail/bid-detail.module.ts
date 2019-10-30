import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SlickModule } from 'ngx-slick';
import { MomentModule } from 'ngx-moment';
import { CountdownModule } from 'ngx-countdown';
import { NgxCurrencyModule } from 'ngx-currency';
 
import { LightboxModule } from '@ngx-gallery/lightbox';

import { CriaturoDndModule } from '../../criaturo/criaturo-dnd.module';
import { BidsService, ListingsService } from '@app/shared/api';

import { BidDetailRoutingModule } from './bid-detail-routing.module';
import { BidDetailComponent } from './bid-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CreditCardComponent } from '@app/pages/template/credit-card/credit-card.component';

import {GalleryModule} from '@ks89/angular-modal-gallery';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,

    BidDetailRoutingModule,

    SlickModule,
    MomentModule,
    CountdownModule,
    NgxCurrencyModule,
    LightboxModule,
    NgbModule,
    PdfViewerModule,
    CriaturoDndModule,
    GalleryModule
  ],
  declarations: [BidDetailComponent, CreditCardComponent],
  providers: [ListingsService, BidsService]
})
export class BidDetailModule { }
