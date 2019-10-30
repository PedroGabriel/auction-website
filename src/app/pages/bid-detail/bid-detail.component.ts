import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewChild,
  NgZone
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { SlickModule } from 'ngx-slick';

import { Gallery, GalleryRef } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';

import { AuthenticationService } from '@app/core';
import { BidsService, ListingsService, UsersService, PaymentsService } from '@app/shared/api';
import { DateService } from '@app/shared/date.service';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommentsService } from '@app/shared/api/comments/comments.service';
import { InspectionService } from '@app/shared/api/inspection/inspection.service';

import {
  GalleryService,
  Image,
  ImageModalEvent,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  AccessibilityConfig,
  AdvancedLayout,
  ButtonsStrategy,
  ButtonsConfig,
  ButtonType,
  ButtonEvent,
} from '@ks89/angular-modal-gallery';


@Component({
  selector: 'app-bid-detail',
  templateUrl: './bid-detail.component.html',
  styles: [`
  a {
    color:black;
  }
  .bid-now-btn {
    width: 100%;
    margin: 10px 0;
    opacity: 1;
    border-radius: 3px;
    border: none;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-align: center;
    color: #ffffff;
    text-transform: uppercase;
    padding: 10px 0;
    background-color:#f05b7a;
  }
  #modalConfirmBid .modal-body {
    padding-top:0px;
  }
  #modalReportComment .modal-body {
    padding-top:0px;
  }
  #modalReportComment textarea {
    resize: none;
  }
  .confirm-bid-details {
    background: #f7f7f7;
    border-radius: 4px;
    justify-content: center;
    display: flex;
    vertical-align: middle;
    align-items: center;
  }
  .user-rate-group {

    clear: both;
    display: block;
    position: relative;
    width: 100%;
    margin:0 0 30px 0;
    min-height: 10px;
  }
  .user-rate-group li {
    width: 13px;
    height: 40px;
    float: left;
    list-style: none;
    margin: 0 3px;
    cursor: pointer;
    position: relative;
    background-image: url(assets/images/rating-icon.png);
    background-size: 200%;
    background-repeat: no-repeat;
      background-position: 100% 20px;
  }
 .user-rate-group li.checked {
      background-position: 0 20px;
  }
  .profile-info .user-rate-group {
    clear: both;
    display: flex;
    position: relative;
    width: 100%;
    margin: 0 0 0 0;
    justify-content: center;
    min-height: 10px;
    padding: 0px;
  }
  .reviews-item-info .user-rate-group {
    clear: both;
    display: block;
    position: relative;
    width: 100%;
    margin: -10px 0 30px -45px;
    min-height: 10px;
  }
  #modalReportComment .modal-title {
    opacity: 0.8;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.6px;
    color: #404040;
  }
  .custom-control-label {
    opacity: 0.8;
    font-size: 16px;
    letter-spacing: 0.5px;
    color: #404040;
  }
  #modalReportSuccess {
    text-align: center;
  }
  .report-text {
    opacity: 0.8;
    line-height: 1.56;
    letter-spacing: 0.4px;
    color: #808080;
  }
  .card-number {
    font-size: 14px;
    letter-spacing: 0.5px;
    color: #404040;
  }
  `],
  providers: [NgbTooltipConfig]
})
export class BidDetailComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public isCollapsed = false;
  commentLikeCounter: number;

  listing: string; // param
  following: Array<any> = [];
  basePrice: number;

  currentTab: string;
  currentTabGallery: string;

  isLoadingListings: boolean;
  isLoading: boolean;
  listings: object[];

  isLoadingDetail: boolean;
  detail: any;

  isLoadingComments: boolean;
  comments: any;
  commentForm: FormGroup;

  isLoadingBids: boolean;
  bids: Array<any>;
  bidForm: FormGroup;

  isLoadingActivities: boolean;
  activities: Array<any>;

  dateNow: number;
  ratings: any = [];

  frmContactData: any = {
    message: ''
  };
  // user
  logged: boolean;
  userId: string;
  currentUser: any;
  user: any;

  customButtonsConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fa fa-expand white',
        type: ButtonType.FULLSCREEN,
        ariaLabel: 'custom plus aria label',
        title: 'Full-screen',
        fontSize: '20px'
      },
      {
        className: 'fa fa-download white',
        type: ButtonType.DOWNLOAD,
        ariaLabel: 'custom download aria label',
        title: 'Download image',
        fontSize: '20px'
      },
      {
        className: 'fa fa-share white',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom download aria label',
        title: 'Open external',
        fontSize: '20px'
      },
      {
        className: 'fa fa-close white',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      },
    ]
  };
  // slider
  listingsSlideConfig = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      }]
  };
  listingsSlideInnerConfig = {
    lazyLoad: 'ondemand',
    infinite: true,
    arrows: true,
    dots: true
  };
  currentPdfSrc: any = '';

  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;

  paymentInfo: any;

  selectedComment: any = undefined;
  reportMessage = {
    message: '',
    other: ''
  };
  inspectionError = '';

  gallery: any = {
    'full': [],
    'approval': [],
    'exterior': [],
    'interior': [],
    'underside': [],
    'engine': [],
    'imperfections': []
  };
  plainGalleryConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  @ViewChild('modalContactOwner') private modalContactOwner: any;
  @ViewChild('modalRequestInspection') private modalRequestInspection: any;
  @ViewChild('modalConfirmBid') private modalConfirmBid: any;
  @ViewChild('modalSuccess') private modalSuccess: any;
  @ViewChild('modalReportSuccess') private modalReportSuccess: any;
  @ViewChild('modalPdfViewer') private modalPdfViewer: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private slickModule: SlickModule,
    private dateService: DateService,
    private listingsService: ListingsService,
    private bidsService: BidsService,
    private paymentsService: PaymentsService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private usersService: UsersService,
    private lightbox: Lightbox,
    private http: HttpClient,
    private ngbConfig: NgbTooltipConfig,
    private commentService: CommentsService,
    private inspectionService: InspectionService,
    private ngZone: NgZone,
    private galleryService: GalleryService,
  ) {


    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
    this.bidForm = this.formBuilder.group({
      amount: ['', Validators.required]
    });
  }

  ngOnInit() { }

  onCustomButtonBeforeHook(event: any) {
    if (!event || !event.button) {
      return;
    }

    switch (event.button.type) {
      case 3:
        this.downloadFile(`${event.image.modal.img}`)
          .subscribe((data: any) => saveAs(data, 'image'));
        break;
      case 5:
        window.open((event.image.modal.img));
        break;
    }
  }

  onCustomButtonAfterHook(event: any) {
    if (!event || !event.button) {
      return;
    }
  }

  getFollowing() {
    this.usersService
      .getFollowing()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((cars: any) => {
        if (cars != null) {
          this.following = cars;
        }
      });
  }
  checkFollowing(id: string, index?: number) {
    for (let i = 0; i < this.following.length; i++) {
      const item = this.following[i];
      if (item.listing.id === id) {

        return true;
      }
    }

    return false;
  }
  toggleFollowing(id: string, i: number) {
    this.ngZone.run(() => {
      if (!this.checkFollowing(id)) {
        this.listingsService
          .follow(id, this.user)
          .pipe(
            finalize(() => { })
          )
          .subscribe((res: any) => {
            this.getFollowing();
          });
      } else {
        this.listingsService
          .unfollow(id, this.user)
          .pipe(
            finalize(() => { })
          )
          .subscribe((res: any) => {
            this.getFollowing();
          });
      }
    });
  }
  ngAfterViewInit() {

    this.changeTab('bid-information');
    this.changeTabGallery('filter-gallery-exterior');
    this.logged = this.authenticationService.isAuthenticated();
    this.currentUser = this.authenticationService.user;
    this.userId = this.currentUser['id'];
    if (this.userId) {
      this.getUser(this.userId);
      this.getUserPayment();
      this.getFollowing();
    }

    this.initBidDetails();
  }

  setupCardInputs() {
    const style = {
      base: {
        fontSize: '16px',
        color: '#495057',
        fontFamily: '"Open Sans", sans-serif',
        lineHeight: '1.5',
        textAlign: 'middle'
      },
    };

    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount('#card-number');

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount('#card-cvc');
  }

  openAlbum(gallery: string, index: number, fullscreen?: boolean) {
    console.log("Abrindo album", gallery);
    let idGal: any;

    switch (gallery) {
      case 'full':
        idGal = 6;
        break;
      case 'approval':
        idGal = 1;
        break;
      case 'exterior':
        idGal = 2;
        break;
      case 'interior':
        idGal = 7;
        break;
      case 'underside':
        idGal = 3;
        break;
      case 'engine':
        idGal = 4;
        break;
      case 'imperfections':
        idGal = 5;
        break;
    }
    if (idGal) {
      this.galleryService.openGallery(idGal, index);
    }
  }

  initBidDetails(listingId?: any) {
    this.comments = [];
    this.bids = [];
    this.activities = [];
    this.basePrice = 0;
    this.commentLikeCounter = 0;
    this.isLoadingListings = true;
    this.isLoadingDetail = true;
    this.isLoadingComments = true;
    this.detail = null;

    if (listingId == null) {
      this.activatedRoute.params.subscribe(params => {
        this.listing = params['listing'];
      });
    } else {
      this.listing = listingId;
    }
    // recommended listings
    this.listingsService
      .list()
      .subscribe((listings: any[]) => {
        console.log('ls', listings);
        if (listings) {
          this.listings = listings.filter(listing => {
            return this.timeLeft(listing.auctionStart._seconds) - this.dateNow > 0;
          });
          // this.listings = listings;
        } else {
          this.router.navigate(['/home/']);
        }
      });

    const that = this;

    // details
    this.listingsService
      .get(this.listing, true)
      .subscribe((listing: any) => {
        if (listing.id != null) {
          this.detail = listing;
        } else {
          this.router.navigate(['/home/']);
        }
        const gallery: any = ['approval', 'exterior', 'interior', 'underside', 'engine', 'imperfections'];

        this.gallery['full'] = [];

        for (let gal of gallery) {
        console.log( listing[gal]);
          this.mountGallery(gal, listing[gal]);
        }

        if (this.detail !== undefined && this.detail.user !== undefined) {
          const userId: any = listing.user.id;

          this.usersService.get(userId, true).subscribe((user: any) => {
            listing.user = user;
            this.detail = listing;
            this.isLoadingListings = false;
            this.usersService.ratings(user.id).subscribe((ratings: any) => {
              this.isLoading = false;

              for (let i = 0; i < ratings.length; i++) {
                const aux: any = ratings[i];
                if (aux.from != null) {
                  this.usersService.get(aux.from.id, true).subscribe((u: any) => {
                    this.isLoading = false;
                    if (aux !== undefined) {
                      aux.from = u;
                    }
                  });
                }
                this.ratings.push(aux);
              }
            });



          });
        }
        this.basePrice = listing['price'];
      });

    // comments
    this.getComments();

    // bids/activities
    this.bidsService
      .byListingOrderBy(this.listing, 'finalPrice')
      .subscribe((bids: any) => {
        this.isLoadingActivities = false;
        this.activities = bids;
        this.activities.sort((x: any, y: any) => {
          return y.timestamp._seconds - x.timestamp._seconds;
        });

        for (const item of this.activities) {
          this.usersService.get(item.user.id, true).subscribe(user => {
            item.user = user;
          });
        }
      });
  } 
    mountGallery(type:any, arr:any) {
    if(arr !== undefined) {
      let fullId:number = this.gallery['full'].length;

      for (let x = 0; x < arr.length; x++) {
            this.gallery[type].push(new Image(x, {
              img: arr[x]
            })
          ); 
            this.gallery['full'].push(new Image(fullId, {
              img: arr[x]
            })
          ); 
            fullId++;
      }
    }
  }

  getUser(userId: string) {
    this.isLoading = true;
    this.usersService.get(userId, true).subscribe(user => {
      this.isLoading = false;
      this.user = user;
    });
  }

  getUserPayment() {
    this.usersService.paymentInfo(this.userId)
      .subscribe(paymentInfo => {
        this.paymentInfo = paymentInfo;
        console.log(paymentInfo);
      });
  }
  getComments() {
    this.listingsService
      .getComments(this.listing)
      .subscribe((comments: any) => {
        if (comments != null) {
          for (const item of comments) {
            if (item.likes !== undefined) {
              item.likesCount = item.likes.length;
            } else {
              item.likesCount = 0;
            }
          }
        }
        this.isLoadingComments = false;
        this.comments = comments;
      });
  }

  submitComment() {
    const comment: any = {
      comment: this.commentForm.value.comment,
      user: this.authenticationService.user
    };
    this.comments.unshift(comment);
    this.listingsService.createComment(this.listing, comment).subscribe(
      (response: object) => {
        if (response && response['id']) {
          this.playCommentSound();
          this.commentForm.markAsPristine();
          this.commentForm.reset();
        } else {
          this.comments.shift();
        }
      },
      error => {
        this.comments.shift();
      }
    );

  }

  submitBid() {
    this.isLoading = true;
    const prevBasePrice: number = this.basePrice;

    const bid: any = {
      amount: this.bidForm.value.amount - this.basePrice,
      basePrice: this.basePrice,
      user: this.user,
      listingId: this.listing
    };

    this.activities.unshift(bid);
    // this.basePrice = this.basePrice + this.bidForm.value.amount;
    this.basePrice = this.bidForm.value.amount;

    this.bidsService.create(this.listing, bid)
      .subscribe((response: object) => {
        if (response && response['id']) {
          this.playBidSound();
          this.bidForm.markAsPristine();
          this.bidForm.reset();
        } else {
          this.activities.shift();
          this.basePrice = prevBasePrice;
        }
        this.isLoading = false;
      },
        error => {
          this.activities.shift();
          this.basePrice = prevBasePrice;
          this.isLoading = false;
        }
      );

    // bid.finalPrice = prevBasePrice + bid.amount;
    bid.finalPrice = prevBasePrice + bid.amount;
    bid.timestamp = { _seconds: Date.now() / 1000 };
    this.closeModal();
  }



  changeTab(tab: string): boolean {
    this.currentTab = tab;
    return false;
  }

  changeTabGallery(tab: string): boolean {
    this.currentTabGallery = tab;
    return false;
  }

  ngAfterViewChecked() {
    this.dateNow = Date.now() / 1000;
    this.cdRef.detectChanges();
  }

  timeLeft(current: number): number {
    return current + (60 * 60 * 24 * 21);
  }

  percentage(current: number): number {
    return this.dateService.percentage(current, this.dateNow);
  }

  openModal(content: any, config?: object): boolean {
    if (this.bidForm.value.amount > this.basePrice) {
      this.modalService.open(content, config);
    }

    return false;
  }

  openPaymentModal(content: any) {
    this.modalService.open(content);
  }

  openModalReport(comment: any, content: any, config?: object): boolean {
    this.selectedComment = comment;
    this.modalService.open(content, config);

    return false;
  }

  openModalcontact(content: any, config?: object): boolean {
    this.modalService.open(content, { windowClass: 'modalRequestContact' });
    return false;
  }

  openModalInspection(content: any, config?: object): boolean {
    this.modalService.open(content, { windowClass: 'modalRequestInspection', size: 'lg' });
    // this.setupCardInputs();
    return false;
  }

  openModalPdf(content: any, file: any, config?: object): boolean {
    this.currentPdfSrc = '';
    this.currentPdfSrc = `${file}`;

    this.modalService.open(content, { windowClass: 'modalPdfViewerRoot' });
    this.isLoading = true;
    return false;
  }

  async requestInspection() {
    try {
      const token = await this.authenticationService.authService.setToken();
      localStorage.setItem('_token', token);
      this.inspectionService.requestInspection(this.listing)
        .subscribe(res => {
          this.modalService.dismissAll();
          this.openPaymentModal(this.modalSuccess);
        }, error => {
          if (error.error && error.error.name === 'inspection_request') {
            this.inspectionError = error.error.message;
          } else {
            this.inspectionError = 'There was an error on your request, please try again later.';
          }
          console.log(error);
        });
    } catch (error) {
      this.inspectionError = 'There was an error on your request, please try again later.';
      console.log(error);
    }
  }

  commentLikeCount(id: string, index: number) {
    // if (this.commentLikeCounter === 0) {
    //   this.commentLikeCounter = 1;
    // } else {
    //   this.commentLikeCounter = 0;
    // }
    if (!this.checkLike(index)) {
      this.listingsService
        .likeComment(this.listing, id)
        .subscribe((res: object) => {
          this.comments[index].likesCount++;
          if (this.comments[index].likes === undefined) {
            this.comments[index].likes = [];
          }

          this.comments[index].likes.push(this.userId);
        });
    } else {
      this.listingsService
        .unlikeComment(this.listing, id)
        .subscribe((res: object) => {
          if (this.comments[index].likesCount > 0) {
            this.comments[index].likesCount--;
          }

          this.removeLike(index);
        });
    }
  }
  checkLike(index: number) {
    const item: any = this.comments[index];

    if (item.likes !== undefined && item.likes.length > 0) {
      for (let i = 0; i < item.likes.length; i++) {
        if (item.likes[i] === this.userId) {
          return true;
        }
      }
    }

    return false;
  }
  removeLike(index: number) {
    const item: any = this.comments[index];

    if (item.likes !== undefined && item.likes.length > 0) {
      for (let i = 0; i < item.likes.length; i++) {
        if (item.likes[i] === this.userId) {
          item.likes.splice(i, 1);
          return true;
        }
      }
    }

    return false;
  }
  closeModal() {
    this.modalService.dismissAll();
    return true;
  }
  getUserImage(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img && img.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + img);
    } else if (img) {
      return img;
    } else {
      return 'assets/images/user-photo-50x50.jpg';
    }
  }

  openBid(id: any) {
    this.router.navigate(['/bid-detail/' + id]);
    this.initBidDetails(id);
  }
  downloadFile(url: string) {
    return this.http.disableApiPrefix().disableTokenHeader().get(url,
      {
        responseType: 'blob'
      });
  }
  makeTrustedImage(item: any) { 
    if(item) {
      const url = typeof item === 'string' ? item : item.content;
      const auxBase = 'data:image/jpg;base64,';
      if (url && url.search('http') === -1) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + url);
      } else if (url && url != null) {
        return url;
      } else {
        return this.detail.approval[0];
      }
    }
    else
      return null;
  }
  getCover(item:any) { 
    if(item)
      return this.makeTrustedImage(item);
    else {
      return this.makeTrustedImage(this.gallery.exterior[0]);
    }
  }
  openFile(src: string, type: string, fileName: string, modal: any) {
    switch (type) {
      case 'pdf':
        if (src.search('://') === -1) {
          this.currentPdfSrc = `${window.location.host}/${src}`;
        } else {
          this.currentPdfSrc = src;
        }

        this.openModalPdf(modal, this.currentPdfSrc);
        break;
      default:
        this.downloadFile(`${src}`)
          .subscribe((data: any) => saveAs(data, type + ' ' + fileName));
        break;
    }
  }
  checkBidAmount() {
    return this.bidForm.value.amount === 0 || this.bidForm.value.amount > this.basePrice;
  }
  sendMessage(modal: any) {
    if (this.detail.user !== undefined) {
      this.usersService.sendMessage(this.detail.user.id, {
        message: this.frmContactData.message
      }).subscribe((user: any) => {
        this.modalService.dismissAll();
        this.modalService.open(modal);
      });
    }
  }
  playBidSound() {
    const audio: any = new Audio('assets/sounds/bid.mp3');
    audio.play();
  }
  playCommentSound() {
    const audio: any = new Audio('assets/sounds/comment.mp3');
    audio.play();
  }
  getThumb(image: string, size: number) {
    const src: string = image;
    const tmpName: string = src.substring(image.lastIndexOf('%2F') + 3);
    const aux = `thumb@${size}_${tmpName}`;

    return image.replace(tmpName, aux);
  }

  submitReport() {
    const message = this.reportMessage.message === 'other' ? this.reportMessage.other : this.reportMessage.message;
    this.commentService.reportComment(this.listing, this.selectedComment.id,
      message, this.currentUser)
      .subscribe(response => {
        if (response && response['id']) {
          this.modalService.dismissAll();
          this.modalService.open(this.modalReportSuccess, { size: 'sm' });
        } else {
          console.log('some error occured');
        }
      });
  }
  checkBidParticipation(): boolean {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.userId === this.activities[i].user.id) {
        return true;
      }
    }
    return false;
  }
  getFinishedStatus() {
    const winner: boolean = this.detail.lastBidder && this.detail.lastBidder.id === this.userId,
      userParticipation: boolean = this.checkBidParticipation();

    if (winner) {
      return 'success';
    } else if (!winner && userParticipation) {
      return 'failed';
    } else {
      return 'finished';
    }
  }
}
