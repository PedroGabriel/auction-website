import { Component, OnInit, NgZone, ViewChild, IterableDiffers } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService, CarsService } from '@app/shared/api';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { MapsAPILoader } from '../../../../../node_modules/@agm/core';
import { Gallery } from '../../../../../node_modules/@ngx-gallery/core';
import { IImage, ImageCompressService } from '../../../../../node_modules/ng2-image-compress';

@Component({
  selector: 'app-review-submit',
  templateUrl: './review-submit.component.html',
  styles: [`
  .btn-edit-listing {
    float:right;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.1px;
    text-align: right;
    color: #f05b7a !important;
  }
  .custom-radio {
    width: 100%;
    clear: both;
    position: relative;
    display: block;
    margin: 0 !important;
    padding: 0;
  }
  .row {
    margin: 20px 0;
    text-align: left;
  }
  .listing-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #abb4bd;
    margin: 0 0 5px 0;
    text-transform: uppercase;
  }
  .listing-value {
    opacity: 0.8;
    font-size: 14px;
    color: #404040;
  }
  .btn-upload-photo {
    width:250px;
    font-size:.9rem !important;
    font-weight:bold;
    background-color:#f05b7a;
    border:0px;
    color:white;
    padding:12px 20px;
    border-radius:4px;
    display: block;
    margin: 20px auto;
  }
  .uploading {
    opacity:.6;
  }

  .custom-radio {
    width: 100%;
    clear: both;
    position: relative;
    display: block;
    margin: 0 !important;
    padding: 0;
  }
  .line {
    height: 1px;
    opacity: 0.3;
    background-color: #404040;
    margin: 10px 0px 19px;
  }
  .inspection-text {
    opacity: 0.7;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #abb4bd;
    text-transform: uppercase;
  }
  .btn-reject {
    border-radius: 4px;
    background-color: #f96476;
    color: white;
    font-size: 12px;
    text-transform: uppercase;
    border: none;
    padding: 7px 20px;
  }
  .btn-accept {
    border-radius: 4px;
    background-color: #7edf6c;
    color: white;
    font-size: 12px;
    text-transform: uppercase;
    border: none;
    padding: 7px 20px;
  }
  .txtCat {
    text-transform:capitalize;
  }
  .dnd-drag-start {
  -moz-transform:scale(0.8);
  -webkit-transform:scale(0.8);
  transform:scale(0.8);
  opacity:0.7;
  border: 2px dashed #000;
  }

  .dnd-drag-enter {
      opacity:0.7;
      border: 2px dashed #000;
  }

  .dnd-drag-over {
      border: 2px dashed #000;
  }

  .dnd-sortable-drag {
    -moz-transform:scale(0.9);
    -webkit-transform:scale(0.9);
    transform:scale(0.9);
    opacity:0.7;
    border: 1px dashed #000;
  }
  .search-group-box {
    border-radius: 0px 0 4px 4px;
    clear: both;
    position: absolute;
    width: 94%;
    background: white;
    left: 3%;
    top: 80px;
    border-radius: 2px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border: solid 0.5px rgba(171, 180, 189, 0.3);
    padding-top: 10px;
    z-index: 99;
    }
    .gallery-cover {

      width: 100%;
      height: 250px;
      display: flex;
      margin: 5px;
      position: relative;
      vertical-align: middle;
      justify-content: center;
      overflow: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 4px;
      flex-direction: row;
    }
    .btn-cover{

      float: right;
      height: 30px;
      font-size: 11px;
      border-radius: 4px;
      position: absolute;
      right: 15px;
      top: 15px;
      }
      .btn-erase {
        position: absolute;
        left: 10px;
        top: 10px;
        background-color: #fff;
        padding: 0px;
        width: 30px;
        height: 30px;
        border-radius: 0px;
        border:0px;
      }
      .btn-erase span {
        font-size:13px;
      }
      .btn-erase-confirm i {
        margin-left:-5px;
      }
      .btn-erase-confirm {
        background:#f1453e !important;
        width:100px;
        color:white;
      }
      .btn-erase img {
        height:25px;
      }
      .sort-item img {
        max-width: 100% !important;
        height: auto !important;
        display: block;
        z-index: 0;
      }
      .tab-pane .p-2 {
        max-height: 120px;
        overflow: hidden;
      }
      section .nav-link {
        color: #0073dd !important;
      }
      section a.nav-link.active {
        color: #f05b7a !important;
      }
      .custom-radio {
        margin-left: 20px !important;
      }
  `]
})
export class NewCarReviewSubmitComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;
  brandsModels: any[] = [];
  frmBasicGroup: FormGroup;
  editing: any = {
    basic: false,
    additional: false
  };
  searchData: any = {
    places: [],
    input: ''
  };
  formData: any = {
    address_zipcode: '',
    address_name: '',
    address_state: '',
    address_city: '',
    address_country: '',
    address: ''
  };
  addressChanged = true;
  showSearchGroup = false;
  invalidAddress = false;
  firstSearch = true;
  latitude: number;
  longitude: number;

  iterableDiffer: any = {
    'interior': null,
    'exterior': null,
    'underside': null,
    'engine': null,
    'imperfections': null
  };

  tinyMceSettings: any = {
    skin_url: '/assets/tinymce/skins/ui/oxide',
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    height: 250,
    menubar: false,
    plugins: 'fullscreen',
    toolbar: 'undo redo | bold italic'
  };

  isLoaded = false;

  isLoading: boolean;

  categories: any = ['exterior', 'interior', 'underside', 'engine', 'imperfections'];

  currentYear = new Date().getFullYear();

  currentTab: string;

  msgEvento: any = [];

  @ViewChild('address')
  private searchElementRef: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private carsService: CarsService,
    private ngZone: NgZone,
    private domSanitizer: DomSanitizer,
    private mapsApiLoader: MapsAPILoader,
    public gallery: Gallery,
    private _iterableDiffers: IterableDiffers
  ) {
    this.frmBasicGroup = this.formBuilder.group(
      {
        year: [''],
        brand: [''],
        model: [''],
        yearsOwned: [''],
        owners: [],
        saleReason: [],
        roadworthy: [],
        accidents: [],
        issuesCheck: [],
        reservePrice: [],
        issues: []
      }
    );
  }

  range = (start: number, stop: number, step: number = 1) =>
    Array(Math.ceil((stop + 1 - start) / step))
      .fill(start)
      .map((x, y) => x + y * step)
      .reverse()

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.listing = params['listing'];
    });

    this.changeTab('galleryexterior');

    this.user = this.authenticationService.user;

    this.brandsModels = [];
    this.carsService
      .get()
      .subscribe((cars: any) => {
        if (cars && cars.brands) {
          for (const obj of cars.brands) {
            if (this.brandsModels !== undefined) {
              this.brandsModels.push({ key: obj, models: cars[obj] });
            }

          }
          this.brandsModels = this.brandsModels.sort((a, b) => a.key.localeCompare(b.key));
        }
      });
    if (this.listing) {
      this.listingsService.get(this.listing, true).subscribe(listing => {
        this.listingObject = listing;

        const refGal = {
          approval: this.gallery.ref('approval'),
          interior: this.gallery.ref('interior'),
          exterior: this.gallery.ref('exterior'),
          underside: this.gallery.ref('underside'),
          engine: this.gallery.ref('engine'),
          imperfections: this.gallery.ref('imperfections')
        };

        if (listing['exterior']) {
          listing['exterior'].forEach((e: any, i: any) => {
            refGal['exterior'].addImage({ src: e, thumb: e });
          });
        }
        if (listing['interior']) {
          listing['interior'].forEach((e: any, i: any) => {
            refGal['interior'].addImage({ src: e, thumb: e });
          });
        }
        if (listing['approval']) {
          listing['approval'].forEach((e: any, i: any) => {
            refGal['approval'].addImage({ src: e, thumb: e });
          });
        }
        if (listing['underside']) {
          listing['underside'].forEach((e: any, i: any) => {
            refGal['underside'].addImage({ src: e, thumb: e });
          });
        }
        if (listing['engine']) {
          listing['engine'].forEach((e: any, i: any) => {
            refGal['engine'].addImage({ src: e, thumb: e });
          });
        }
        if (listing['imperfections']) {
          listing['imperfections'].forEach((e: any, i: any) => {
            refGal['imperfections'].addImage({ src: e, thumb: e });
          });
        }
        this.isLoaded = true;
        this.iterableDiffer.exterior = this._iterableDiffers.find([]).create(null);
        this.iterableDiffer.interior = this._iterableDiffers.find([]).create(null);
        this.iterableDiffer.underside = this._iterableDiffers.find([]).create(null);
        this.iterableDiffer.engine = this._iterableDiffers.find([]).create(null);
        this.iterableDiffer.imperfections = this._iterableDiffers.find([]).create(null);

        console.log(refGal);
        if (this.listingObject) {
          this.mapsApiLoader.load().then(() => {
            const options = {
              types: ['(regions)']
            };
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
            autocomplete.setComponentRestrictions({ 'country': 'us' });
            autocomplete.addListener('place_changed', () => {
              this.ngZone.run(() => {
                console.log('place changed');
              });
            });
          });
        }

      });
    }
  }

  nextStep(): boolean {
    this.isLoading = true;
    this.usersService.paymentInfo(this.user['id'])
      .subscribe(paymentInfo => {
        console.log(paymentInfo);
        if (paymentInfo && paymentInfo['paymentMethodRegistered']) {
          this.stepToReview();
        } else {
          this.stepToCardInfo();
        }
      }, error => {
        this.stepToCardInfo();
      });
    return false;
  }

  stepToReview() {
    this.listingsService.edit(this.listing, { registerStep: 'waiting-approval-final' }).subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['/new-car/waiting-approval-final/' + this.listing], { replaceUrl: true });
    });
  }

  stepToCardInfo() {
    this.listingsService.edit(this.listing, {
      registerStep: 'card-information',
    }).subscribe((response: object) => {
      this.isLoading = false;
      this.router.navigate(['/new-car/card-information/' + this.listing], { replaceUrl: true });
    });
  }

  getSelectedModels() {
    for (const item of this.brandsModels) {
      if (item.key === this.listingObject.brand) {
        return item.models;
      }
    }
    return [];
  }

  changedModel(model: string) {
    this.listingObject.model = model;
  }

  confirmEdit(tp: string) {
    switch (tp) {
      case 'basic':
        if (this.editing.basic) {
          if (this.listingObject.model) {
            this.listingObject.model = this.listingObject.model.toString().trim();
          }
          this.listingsService.edit(this.listing, this.listingObject).subscribe((response: object) => {
          });
        }
        this.editing.basic = !this.editing.basic;
        break;
      case 'additional':
        if (this.editing.additional) {
          this.listingsService.edit(this.listing, this.listingObject).subscribe((response: object) => {
          });
        }
        this.editing.additional = !this.editing.additional;
        break;
      case 'location':
        if (this.editing.location) {
          this.listingObject.address = {
            zipcode: this.formData.address_zipcode,
            name: this.formData.address_name,
            state: this.formData.address_state,
            city: this.formData.address_city,
            country: this.formData.address_country,
            location: {
              _latitude: this.latitude,
              _longitude: this.longitude,
            }
          };
          this.listingsService.edit(this.listing, this.listingObject).subscribe((response: object) => {
          });
        }
        this.editing.location = !this.editing.location;
        break;
      case 'cover': {
        if (this.listingObject.cover) {
          this.listingsService.uploadCover(this.listing, this.listingObject.cover)
            .subscribe((response: object) => {
            });
        }
        break;
      }
    }
  }

  changeTab(tab: string): boolean {
    if (!this.isLoading) {
      this.currentTab = tab;
    }

    return false;
  }

  checkBase(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img.search(auxBase) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  getThumb(image: string, size: number) {
    const src: string = image;
    const tmpName: string = src.substring(image.lastIndexOf('%2F') + 3);
    const aux: string = 'thumb@' + size + '_' + tmpName;

    return image.replace(tmpName, aux);
  }

  selectPlace(query: any) {
    this.ngZone.run(() => {
      this.isLoading = true;
      this.showSearchGroup = false;
      const service: any = new google.maps.places.PlacesService(document.createElement('div')),
        request = {
          query: query
        };

      service.textSearch(request, (res: any) => {

        const place: any = res[0];
        console.log(place);
        const request2: any = {
          placeId: place.place_id,
          fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'address_components']
        };
        const service2: any = new google.maps.places.PlacesService(document.createElement('div'));

        service2.getDetails(request2, (p: any) => {
          let number = '';
          let address = '';
          let neighborhood = '';
          let zipcode = '';
          let country = '';
          let state = '';
          let city = '';
          for (let i = 0; i < p.address_components.length; i++) {
            const item: any = p.address_components[i];
            console.log(item);
            if ($.inArray('street_number', item.types) !== -1) {
              number = item.long_name;
            }
            if ($.inArray('route', item.types) !== -1) {
              address = item.long_name;
            }
            if ($.inArray('locality', item.types) !== -1) {
              city = item.long_name;
            }
            if ($.inArray('administrative_area_level_2', item.types) !== -1 ||
              $.inArray('sublocality_level_1', item.types) !== -1 || $.inArray('neighborhood', item.types) !== -1) {
              neighborhood = item.long_name;
            }
            if ($.inArray('administrative_area_level_1', item.types) !== -1) {
              state = item.short_name;
            }
            if ($.inArray('country', item.types) !== -1) {
              country = $.trim(item.short_name).toString();
            }
            if ($.inArray('postal_code', item.types) !== -1) {
              zipcode = item.long_name;
            }
          }
          this.formData.address_zipcode = zipcode;
          this.formData.address_name = address;
          this.formData.address_state = state;
          this.formData.address_country = country;
          this.formData.address_city = city;
          this.addressChanged = true;
          console.log(this.formData);
          if (!state || !city || !country) {
            this.invalidAddress = true;
            return;
          }
          this.invalidAddress = false;
          this.isLoading = false;
          this.showSearchGroup = false;

        });

        this.searchData.input = res[0].formatted_address;
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.isLoading = false;
      });
    });
  }

  querySearch(evt?: Event) {
    this.ngZone.run(() => {
      this.searchData.places = [];

      if (this.firstSearch || this.searchData.input === '') {
        this.showSearchGroup = false;
        this.firstSearch = false;
      } else {
        if (!this.isLoading) {
          this.showSearchGroup = true;
        }
      }

      this.doSearchListings(this.searchData.input);
      $(() => {
        $('.pac-container .pac-item').each((index: any, elm: any) => {
          this.searchData.places.push($(elm).children(' span:nth-child(2)').text() + ', ' +
            $(elm).children(' span:nth-child(3)').text());
        });
        console.log(this.searchData);
      });
    });
  }

  doSearchListings(query: any) {
    $(() => {
      this.ngZone.run(() => {
        $('.pac-container').css('z-index', '-999999');
      });
    });
  }

  showSearchGroupToggle() {
    this.showSearchGroup = true;
  }
  closeSearchGroup() {
    setTimeout(() => { this.showSearchGroup = false; }, 1000);
  }

  makeTrustedImage(item: any) {
    if (item) {
      const url = typeof item === 'string' ? item : item.content;
      const prefix = 'data:image/jpg;base64,';
      if (url && url.search('http') === -1) {
        const style = 'url(' + prefix + url + ')';
        console.log(this.domSanitizer.bypassSecurityTrustStyle(style));
        return this.domSanitizer.bypassSecurityTrustStyle(style);
      } else {
        return `url(${url})`;
      }
    }
  }
  uploadFiles(files: any, modal: any) {
    for (let i = 0; i < files.length; i++) {
      const file: any = files[i];
      const fr: FileReader = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = (e) => {
        const auxBase: any = (fr.result);

        const aux: any = {
          filename: file['name'],
          size: file['size'],
          encoding: 'base64',
          contentType: file['type'],
          content: (auxBase).toString().split(',')[1]
        };
        this.addPhoto(aux);
      };
    }
  }
  addPhoto(file: any) {
    if (file.size <= 5242880) {
      this.submit(file);
    } else {
      this.msgEvento.push('The photo exceeds 5 MB maximum file size.');
    }

  }
  submit(file: any) {
    this.isLoading = true;
    this.listingObject[this.getCurrentTab()].push('data:image/jpg;base64,' + file.content);
    const index: number = this.listingObject[this.getCurrentTab()].length - 1;

    this.listingsService
      .uploadPhotos(this.listing, this.getCurrentTab(), [file])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: object) => {
        this.listingObject[this.getCurrentTab()][index] = response[0];
      });
  }
  getCurrentTab() {
    switch (this.currentTab) {
      case 'galleryapproval':
        return 'approval';
      case 'galleryimperfections':
        return 'imperfections';
      case 'galleryinterior':
        return 'interior';
      case 'galleryunderside':
        return 'underside';
      case 'galleryengine':
        return 'engine';
      case 'galleryexterior':
        return 'exterior';
    }
  }

  uploadCover(file: any, type: any) {
    const images: Array<IImage> = [];
    ImageCompressService.filesToCompressedImageSource(file).then((observableImages: any) => {
      observableImages.subscribe((image: any) => {
        images.push(image);
      }, (error: any) => {
        console.log('Error while converting');
      }, () => {
        console.log('Images', images);
        let image: any;

        if (images[0].compressedImage != null) {
          image = images[0].compressedImage;
        } else {
          image = images[0];
        }

        const aux: any = {
          filename: image['fileName'],
          size: this.getBase64Size(image['imageDataUrl']),
          encoding: 'base64',
          contentType: image['type'],
          content: (image['imageDataUrl']).toString().split(',')[1]
        };

        aux.index = 0;
        this.listingObject.cover = aux;
        this.confirmEdit('cover');
      });
    });
  }
  getBase64Size(base: any) {
    const head = 'data:image/png;base64,';
    return Math.round((base.length - head.length) * 3 / 4);
  }
}
