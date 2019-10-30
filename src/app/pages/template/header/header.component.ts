import { Component, NgZone, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { MapsAPILoader } from '@agm/core';
import * as $ from 'jquery';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ListingsService, UsersService, CarsService, PaymentsService } from '@app/shared/api';

import { CriaturoEvtService } from '../../../criaturo/criaturo-evt.service';
const log = new Logger('Header');

import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    form {
      width:100%;
      position:relative;
    }
    .header-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin: 0;

      object-fit: cover;
      object-position: center right;
    }
    .search-group-box {
        border-radius: 0px 0 4px 4px;
        clear: both;
        position: absolute;
        width: 100%;
        background: white;
        left: 0px;
        top: 47px;
      border-radius: 2px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
      border: solid 0.5px rgba(171, 180, 189, 0.3);
      padding-top:10px;
    }
    .resetPasswordBox {
          padding: 10px;
    margin: 10px;
    text-align: center;
    background: #eee;
    border-radius: 8px;
    }
  `]
})
export class HeaderComponent implements OnInit {
  errorLogin: any;
  loginForm: FormGroup;
  registerForm: FormGroup;
  frmResetGroup: FormGroup;
  brands: Array<any>;
  isLoading = false;
  HideSearch = true;
  logged: boolean;
  userId: string;
  currentUser: any;
  user: any;
  listings: any[];
  firstSearch = true;
  latitude: number;
  longitude: number;
  userNotifications: any[] = [];
  newNotification = false;
  qtyNotifications = 0;
  @ViewChild('search')
  searchElementRef: ElementRef;
  @ViewChild('modalCreditCard')
  creditCardModal: ElementRef;
  searchData: any = {
    places: [],
    brands: [],
    input: ''
  };
  showResetLinkMsg = false;

  showSearchGroup = false;

  placeService: google.maps.places.AutocompleteService;
  lastNotificationId = '';
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  menuTrigger = false;

  passwordRecover = {
    email: '',
    error: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private usersService: UsersService,
    private carsService: CarsService,
    private afAuth: AngularFireAuth,
    private paymentsService: PaymentsService,
    private domSanitizer: DomSanitizer,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private evtService: CriaturoEvtService,
    private listingsService: ListingsService
  ) {
    this.createLoginForm();
    this.createRegisterForm();
    this.createResetForm();
    // Refresh user
    // setInterval(() => {
    //   if (this.userId) {
    //     this.getUser(this.userId);
    //   }
    // }, 10 * 4000);
    if (this.evtService.event$ !== undefined) {
      this.evtService.event$.subscribe((evt: any) => {
        console.log('Avatar changed', evt);
        switch (evt.name) {
          case 'avatar-changed':
            this.user.image = evt.data.content; 
            break;
        }
      });
    }
  }
  createResetForm() {
    this.frmResetGroup = this.formBuilder.group(
      {
        email: ['', Validators.required]
      });
  }

  getBrands() {

    this.carsService
      .get()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((cars: any) => {
        if (cars.brands !== undefined) {
          this.brands = [];
          const i = 0,
            limit = 7;

          for (const obj of cars.brands) {
            if (this.brands !== undefined) {
              this.brands.push(obj);
            }

          }
        }
      });
  }
  ngOnInit() {
    this.listings = [{ loading: true }, { loading: true }, { loading: true }];
    this.showSearchGroup = false;
    this.getBrands();

    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.HideSearch = this.route.snapshot.children[0].data['HideSearch'];
    });
    this.HideSearch = this.route.snapshot.children[0].data['HideSearch'];

    this.logged = this.authenticationService.isAuthenticated();
    this.currentUser = this.authenticationService.user;
    this.userId = this.currentUser['id'];

    if (this.userId) {
      this.getUser(this.userId);
    }

    // autocomplete
    this.mapsAPILoader.load().then(() => {
      this.placeService = new google.maps.places.AutocompleteService();
    });
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

  @HostListener('window:scroll', ['$event'])
  onSCroll(event: any) {
    if (this.router.url !== '/') {
      return false;
    }
    if (window.pageYOffset >= 210) {
      this.HideSearch = false;
    } else {
      this.HideSearch = true;
    }
  }

  getUser(userId: string) {
    this.isLoading = true;
    this.usersService.get(userId, true).subscribe((userData: any) => {
      this.isLoading = false;
      this.user = userData;
      this.usersService.notifications(userId).subscribe((notifications: any) => {
        if (notifications !== undefined) {
          this.userNotifications = notifications;
        }

        if (this.userNotifications !== undefined && this.userNotifications.length > 0) {
          const qtyNotifications = this.userNotifications.length - 1;

          if (this.userNotifications[qtyNotifications] !== undefined) {
            if (this.qtyNotifications > 0 && this.lastNotificationId !== this.userNotifications[qtyNotifications].id) {
              this.playBidSound();
            } else if (this.userNotifications[0].id !== localStorage.getItem('lastNotificationId')) {
              if (this.newNotification) {
                this.newNotification = true;
              } else {
                this.playBidSound();
              }
            } else {
              this.newNotification = false;
            }
            this.lastNotificationId = this.userNotifications[qtyNotifications].id;
          }
        }

        this.qtyNotifications = notifications.length;
      });
    });
  }

  saveLastNotification() {
    localStorage.setItem('lastNotificationId', this.userNotifications[0].id);
    setTimeout(() => {
      this.newNotification = false;
    }, 1000);
  }

  login() {
    this.isLoading = true;
    console.log(this.loginForm.value);
    this.authenticationService.login(this.loginForm.value).then(
      credentials => {
        this.loginFinalize(true);

        this.closeModal();
        this.loginForm.reset();
        this.logged = true;
        console.log('credentials', credentials);
        this.getUser(credentials['user']);
        this.evtService.broadcast('logged-in', true);
        this.route.queryParams.subscribe(params =>
          this.router.navigate([params.redirect || '/'], { replaceUrl: true })
        );
      },
      error => {
        this.loginFinalize();
        this.errorLogin = error;
      }
    );
  }

  logout() {
    this.logged = false;
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/'], { replaceUrl: true }));
  }

  register() {
    this.isLoading = true;
    this.errorLogin = null;
    this.authenticationService.register(this.registerForm.value).then(
      credentials => {
        this.currentUser = this.authenticationService.user;
        this.registerFinalize(true);
        this.logged = true;
        this.openCardModal();
        // this.route.queryParams.subscribe(params =>
        //   this.router.navigate([params.redirect || '/'], { replaceUrl: true })
        // );
      },
      error => {
        this.registerFinalize();
        this.errorLogin = error;

      }
    );
  }

  openCardModal() {
    this.closeModal();
    this.openModal(this.creditCardModal, { size: 'lg', centered: true });
    this.setupCardInputs();
  }

  async registerCard() {
    this.isLoading = true;

    const ownerInfo = {
      owner: {
        name: this.currentUser['name'],
        email: this.currentUser['email']
      },
    };

    const { source, error } = await stripe.createSource(this.cardNumber, ownerInfo);
    if (error) {
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      const payment = {
        email: this.currentUser['email'],
        userId: this.currentUser['id'],
        sourceId: source.id
      };
      this.paymentsService.creditCard(payment)
        .subscribe((response: object) => {
          this.isLoading = false;
          this.closeModal();
          this.route.queryParams.subscribe(params =>
            this.router.navigate([params.redirect || '/'], { replaceUrl: true })
          );
        });
    }
  }

  openModal(content: any, config?: object): boolean {
    this.modalService.open(content, config);
    return false;
  }

  closeModal() {
    this.modalService.dismissAll();
    return true;
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
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
  brandSearch() {
    this.searchData.brands = [];
    const tmpBrands: any = this.brands,
      data: any = this.searchData.input;
    if (data !== '' && this.searchData.brands !== undefined) {
      this.searchData.brands = tmpBrands.filter((value: any) => {
        value.replace('-', ' ');
        data.replace('-', ' ');
        return value.toLowerCase().indexOf(data.toLowerCase()) >= 0;
      });
    } else {
      this.searchData.brands = [];
    }
  }

  placeSearch() {
    if (this.searchData.input) {
      this.placeService.getPlacePredictions({
        input: this.searchData.input,
        componentRestrictions: { country: 'us' },
        types: ['(regions)']
      }, (results: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.searchData.places = results.map((place: any) => place.description);
        }
      });
    }
  }

  querySearch(evt?: Event) {
    this.searchData.brands = [];
    this.searchData.places = [];

    if (this.firstSearch || this.searchData.input === '') {
      this.showSearchGroup = false;
      this.firstSearch = false;
    } else {
      this.showSearchGroup = true;
    }

    this.brandSearch();
    this.placeSearch();
    console.log(this.searchData);
  }
  doSearchListings(query: any) {
    $(() => {
      this.ngZone.run(() => {
        $('.pac-container').css('z-index', '-999999');
      });
    });

    this.brandSearch();
    // let data:any = {
    //   brand: query,
    //   status: 'live'
    // };

    // this.listingsService
    //   .search(data)
    //   .pipe(
    //     finalize(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe((listings: object) => {
    //     if(listings && typeof listings == typeof [])
    //       this.searchData.brands = listings;
    //     else
    //       this.searchData.brands = [];

    //   });
  }
  search(searchParams?: any) {
    this.ngZone.run(() => {
      this.showSearchGroup = false;
      const navigationExtras: NavigationExtras = {
        queryParams: { 'q': btoa(JSON.stringify(searchParams)) },
        replaceUrl: true
      };

      this.evtService.broadcast('search-changed', searchParams);
      this.router.navigate(['search'], navigationExtras);
      return false;
    });
  }
  selectPlace(item: any) {
    const service: any = new google.maps.places.PlacesService(document.createElement('div')),
      request = {
        query: item
      };

    service.textSearch(request, (res: any) => {
      this.searchData.input = res[0].formatted_address;
      console.log(res);
      const searchParams: any = {
        latitude: res[0].geometry.location.lat(),
        longitude: res[0].geometry.location.lng(),
        address: res[0].formatted_address,
        type: 'location'
      };
      this.search(searchParams);
    });
  }
  selectBrand(brand: any) {
    switch (brand) {
      case 'Mercedes-Benz':
        brand = 'Mercedes';
        break;
    }

    const searchParams: any = {
      brand: brand,
      type: 'brand'
    };
    this.search(searchParams);
  }

  playBidSound() {
    if(this.user.settings.bidSound) { 
      const audio: any = new Audio('assets/sounds/bid.mp3');
      audio.play();
      this.newNotification = true;
    }
  }
  playCommentSound() {
    if(this.user.settings.commentSound) { 
      const audio: any = new Audio('assets/sounds/comment.mp3');
      audio.play();
    }
  }
  submit() {
    this.showResetLinkMsg = false;
    const auth = this.afAuth.auth;
    const email = this.frmResetGroup.value.email;

    auth.sendPasswordResetEmail(email).then(() => {
      this.showResetLinkMsg = true;
    }).catch((error: any) => {
      console.log(error);
    });
  }
  recoverPassword() {
    this.authenticationService.authService.recoverPassword(this.passwordRecover.email)
      .then(response => {
        console.log('success', response);
        this.showResetLinkMsg = true;
        this.passwordRecover.error = '';
      })
      .catch(error => {
        console.log('error', error);
        this.showResetLinkMsg = false;
        this.passwordRecover.error = error.message;
      });
  }

  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }

  private loginFinalize(clear?: boolean) {
    this.loginForm.markAsPristine();
    this.isLoading = false;
    if (clear) {
      this.registerForm.reset();
    }
  }

  private createRegisterForm() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        password: ['', Validators.required],
        password_confirm: ['', Validators.required]
      },
      { validator: this.matchingPasswords('password', 'password_confirm') }
    );
  }

  private registerFinalize(clear?: boolean) {
    this.registerForm.markAsPristine();
    this.isLoading = false;
    if (clear) {
      this.registerForm.reset();
    }
  }
}
