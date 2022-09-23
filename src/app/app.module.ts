import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { SlickModule } from 'ngx-slick';
import { MomentModule } from 'ngx-moment';
import { NgxCurrencyModule } from 'ngx-currency';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryModule as GalleryModulePlugin } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from '@app/core/authentication/auth.service';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { TemplateModule } from './pages/template/template.module';

import { HomeModule } from './pages/home/home.module';
import { AboutModule } from './pages/about/about.module';
import { TermsModule } from './pages/terms/terms.module';
import { ReviewModule } from './pages/review/review.module';
import { PrivacyModule } from './pages/privacy/privacy.module';
import { SeeAllModule } from './pages/see-all/see-all.module';
import { BidDetailModule } from './pages/bid-detail/bid-detail.module';
import { FaqModule } from './pages/faq/faq.module';
import { NotFoundModule } from './pages/not-found/not-found.module';
import { SearchModule } from './pages/search/search.module';
import { UserProfileModule } from './pages/user-profile/user-profile.module';
import { UserEditModule } from './pages/user-edit/user-edit.module';
import { UserSettingsModule } from './pages/user-settings/user-settings.module';
import { UserPaymentModule } from './pages/user-payment/user-payment.module';

import { BasicInformationModule } from './pages/new-car/basic-information/basic-information.module';
import { AdditionalInformationModule } from './pages/new-car/additional-information/additional-information.module';
import { BasicPhotoModule } from './pages/new-car/basic-photo/basic-photo.module';
import { CardInformationModule } from './pages/new-car/card-information/card-information.module';
import { NewCarGalleryModule } from './pages/new-car/gallery/gallery.module';
import { ListingApprovedModule } from './pages/new-car/listing-approved/listing-approved.module';
import { RecordsModule } from './pages/new-car/records/records.module';
import { InspectionModule } from './pages/inspection/inspection.module';
import { ReviewSubmitModule } from './pages/new-car/review-submit/review-submit.module';
import { WaitingApprovalModule } from './pages/new-car/waiting-approval/waiting-approval.module';
import { WaitingApprovalFinalModule } from './pages/new-car/waiting-approval-final/waiting-approval-final.module';
import { YourListingModule } from './pages/new-car/your-listing/your-listing.module';

import { AdminModule } from './pages/admin/admin.module';
import { AdminManageListingsModule } from './pages/admin/pages/manage-listings/manage-listings.module';
import { AdminUsersModule } from './pages/admin/pages/users/users.module';
import { AdminListingsModule } from './pages/admin/pages/listings/listings.module';
import { AdminUserDetailModule } from './pages/admin/pages/user-detail/user-detail.module';
import { AdminEditListingModule } from './pages/admin/pages/edit-listing/edit-listing.module';
import { AdminApprovalListingModule } from './pages/admin/pages/approval-listing/approval-listing.module';
import { AdminUserEditModule } from './pages/admin/pages/user-edit/user-edit.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CriaturoDndModule } from './criaturo/criaturo-dnd.module';
import { CriaturoEvtService } from './criaturo/criaturo-evt.service';
 
import { Ng5SliderModule } from 'ng5-slider';
import { ImageCompressService, ResizeOptions, ImageUtilityService } from 'ng2-image-compress';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommentsModule } from '@app/pages/admin/pages/comments/comments.module';
import { ContenteditableModule } from 'ng-contenteditable';

import { Select2Module } from 'ng2-select2';
import { EditorModule } from '@tinymce/tinymce-angular';

import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: '***REMOVED***',
      libraries: ['places'],
      language: 'en'
    }),
    AgmJsMarkerClustererModule,
    SlickModule,
    MomentModule,
    NgxCurrencyModule,
    GalleryModulePlugin.withConfig({
      loadingMode: 'indeterminate'
    }),
    LightboxModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,

    CoreModule,
    SharedModule,

    TemplateModule,

    HomeModule,
    AboutModule,
    TermsModule,
    ReviewModule,
    PrivacyModule,
    SeeAllModule,
    BidDetailModule,
    FaqModule,
    NotFoundModule,
    SearchModule,
    UserProfileModule,
    UserEditModule,
    UserSettingsModule,
    UserPaymentModule,
    NewCarGalleryModule,
    AdditionalInformationModule,
    BasicInformationModule,
    BasicPhotoModule,
    CardInformationModule, 
    ListingApprovedModule,
    RecordsModule,
    InspectionModule,
    ReviewSubmitModule,
    WaitingApprovalModule,
    WaitingApprovalFinalModule,
    YourListingModule,
    InspectionModule,

    AdminModule,
    AdminManageListingsModule,
    AdminUsersModule,
    AdminListingsModule,
    AdminUserDetailModule,
    AdminEditListingModule,
    AdminApprovalListingModule,
    AdminUserEditModule,
    CommentsModule,

    AppRoutingModule,

    CriaturoDndModule, 
    Ng5SliderModule,
    PdfViewerModule,
    ContenteditableModule,
    Select2Module,
    EditorModule,
    GalleryModule.forRoot()

  ],
  exports: [CriaturoDndModule],
  declarations: [AppComponent],
  providers: [AuthService, CriaturoEvtService, ImageCompressService, ResizeOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
