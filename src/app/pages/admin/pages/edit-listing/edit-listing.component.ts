import { Component, OnInit, ViewChild, IterableDiffers, DoCheck, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ListingsService, CarsService, UsersService } from '@app/shared/api';

import { Gallery } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InspectionService } from '@app/shared/api/inspection/inspection.service';
import { MapsAPILoader } from '@agm/core';
import * as $ from 'jquery';
import { IImage, ImageCompressService } from 'ng2-image-compress';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styles: [`
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
        .custom-radio {
          margin-left: 20px !important;
        }
    `]
})
export class AdminEditListingComponent implements OnInit, DoCheck {
  listing: string; // params
  listingObject: any;
  isLoaded = false;
  currentTab: string;
  isLoading = false;
  listingForm: FormGroup;
  frmBasicGroup: FormGroup;
  locationForm: FormGroup;
  isEditing = false;
  approvalComment: string;
  searchChanged = false;
  user: any = {};

  _album: object;
  categories: any = ['exterior', 'interior', 'underside', 'engine', 'imperfections'];

  photos: any;
  editing: any = {
    basic: false,
    additional: false
  };

  fileList: any = [];
  invalidFiles: any = [];
  msgEvento: any = [];
  qtyFiles = 0;
  brandsModels: any[] = [];
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
  allowed_extensions = ['png', 'jpg', 'bmp', 'png', 'gif', 'jpeg'];

  currentYear = new Date().getFullYear();

  addressChanged = true;
  firstSearch = true;
  showSearchGroup = false;
  invalidAddress = false;
  searchData: any = {
    places: [],
    input: ''
  };
  latitude: number;
  longitude: number;
  formData: any = {
    address_zipcode: '',
    address_name: '',
    address_state: '',
    address_city: '',
    address_country: '',
    address: ''
  };

  canSaveModel = false;

  @ViewChild('modalLoading') private modalLoading: any;
  @ViewChild('address')
  private searchElementRef: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private listingsService: ListingsService,
    private lightbox: Lightbox,
    public gallery: Gallery,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private carsService: CarsService,
    private _iterableDiffers: IterableDiffers,
    private inspectionService: InspectionService,
    private usersService: UsersService,
    private ngZone: NgZone,
    private mapsApiLoader: MapsAPILoader
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
        issues: [],
        vin: '',
        mileageUnit: ''
      }
    );
  }

  range = (start: number, stop: number, step: number = 1) =>
    Array(Math.ceil((stop + 1 - start) / step))
      .fill(start)
      .map((x, y) => x + y * step)
      .reverse()

  ngDoCheck() {
    if (this.iterableDiffer.exterior &&
      this.iterableDiffer.interior &&
      this.iterableDiffer.underside &&
      this.iterableDiffer.engine &&
      this.iterableDiffer.imperfections) {
      const changes: any = {
        exterior: this.iterableDiffer.exterior.diff(this.listingObject.exterior),
        interior: this.iterableDiffer.interior.diff(this.listingObject.interior),
        underside: this.iterableDiffer.underside.diff(this.listingObject.underside),
        engine: this.iterableDiffer.engine.diff(this.listingObject.engine),
        imperfections: this.iterableDiffer.imperfections.diff(this.listingObject.imperfections)
      };

      if (this.isLoaded && !this.isEditing) {
        if (changes.exterior) {
          this.editListing();
        }

        if (changes.interior) {
          this.editListing();
        }

        if (changes.underside) {
          this.editListing();
        }

        if (changes.engine) {
          this.editListing();
        }

        if (changes.imperfections) {
          this.editListing();
        }
      }
    }
  }
  editListing() {
    this.isEditing = true;
    this.listingsService.edit(this.listing, this.listingObject).subscribe((response: object) => {
      this.isEditing = false;
    }, () => {
      this.isEditing = false;
    });
  }
  ngOnInit() {
    this._album = {
      'interior': [],
      'approval': [],
      'exterior': [],
      'underside': [],
      'engine': [],
      'imperfections': []
    };
    this.isLoading = false;
    this.changeTab('galleryexterior');

    this.approvalComment = '';
    this.listingObject = {};

    this.route.params.subscribe(params => {
      this.listing = params['listing'];
    });

    if (this.listing) {
      this.listingsService.get(this.listing, true).subscribe((listing: any) => {
        this.listingObject = listing;
        console.log(this.listingObject);

        if (listing.user !== undefined) {
          this.usersService.get(listing.user.id, true).subscribe(user => {
            this.user = user;
          });
        }
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
        console.log(this.listingObject);
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
      });
    }

    this.brandsModels = [];
    this.carsService
      .get()
      .subscribe((cars: any) => {
        if (cars.brands) {
          for (const obj of cars.brands) {
            if (this.brandsModels !== undefined) {
              this.brandsModels.push({ key: obj, models: cars[obj] });
            }
          }
          this.brandsModels = this.brandsModels.sort((a, b) => a.key.localeCompare(b.key));
        }
      });

  }

  locForm() {
    return this.locationForm.controls;
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
          this.listingObject.address.zipcode = zipcode;
          this.listingObject.address.name = address;
          this.listingObject.address.state = state;
          this.listingObject.address.country = country;
          this.listingObject.address.city = city;
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

        this.listingObject.address.zipcode = res[0].formatted_address;
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.isLoading = false;
      });
    });
  }

  querySearch(evt?: Event) {
    this.ngZone.run(() => {
      this.searchChanged = true;
      this.searchData.places = [];

      if (this.firstSearch || this.listingObject.address.zipcode === '') {
        this.showSearchGroup = false;
        this.firstSearch = false;
      } else {
        if (!this.isLoading) {
          this.showSearchGroup = true;
        }
      }

      this.doSearchListings(this.listingObject.address.zipcode);
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


  changeTab(tab: string): boolean {
    if (!this.isLoading) {
      this.currentTab = tab;
    }

    return false;
  }

  getSelectedModels() {
    for (const item of this.brandsModels) {
      if (item.key === this.listingObject.brand) {
        this.canSaveModel = !item.models.includes(this.listingObject.model);
        return item.models;
      }
    }
    return [];
  }

  changedModel(model: string) {
    this.listingObject.model = model;
  }

  approvalType(approve: boolean, listing: string, comment?: string, price?: number): any {
    if (this.listingObject['state'] === 'pending' && this.listingObject['registerStep'] === 'waiting-approval') {
      return approve
        ? this.listingsService.preApprove(listing, comment)
        : this.listingsService.rejectPreApproval(listing, comment);
    }
    if (
      this.listingObject['state'] === 'pre-approved' &&
      this.listingObject['registerStep'] === 'waiting-approval-final'
    ) {
      return approve
        ? this.listingsService.approve(listing, comment)
        : this.listingsService.rejectApproval(listing, comment);
    }
    if (this.listingObject['state'] === 'approved' && this.listingObject['registerStep'] === 'complete') {
      return approve
        ? this.listingsService.goLive(listing, comment, price)
        : this.listingsService.rejectApproval(listing, comment);
    }
  }

  approve(): boolean {
    const stateChanger = this.approvalType(true, this.listing, this.approvalComment);
    this.isLoading = true;
    stateChanger.subscribe((result: any) => {
      const that = this;
      setTimeout(function () {
        this.isLoading = false;
        that.router.navigate(['/admin'], { replaceUrl: true });
      }, 1000);
    });

    return true;
  }
  removeImg(tab: string, id: number, url?: string) {
    const photos: any = [
      this.listingObject[tab][id]
    ];

    this.listingsService.deletePhoto(this.listing, photos, tab).subscribe((res: any) => {
      this.listingObject[tab].splice(id, 1);
    });
  }
  deny(): boolean {
    const stateChanger = this.approvalType(
      false,
      this.listing,
      this.approvalComment,
      this.listingObject['reservePrice'] ? this.listingObject['reservePrice'] : 0
    );
    this.isLoading = true;
    stateChanger.subscribe((result: any) => {
      const that = this;
      setTimeout(function () {
        this.isLoading = false;
        that.router.navigate(['/admin'], { replaceUrl: true });
      }, 1000);
    });

    return true;
  }

  openAlbum(gallery: string, index: number, fullscreen?: boolean): boolean {
    const config = {};
    // if(fullscreen)
    config['panelClass'] = 'fullscreen';
    this.lightbox.open(index, gallery, config);
    return false;
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
  checkBase(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img.search(auxBase) !== -1) {
      return true;
    } else {
      return false;
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
        if (this.editing.location && this.searchChanged) {
          this.listingObject.address = {
            zipcode: this.listingObject.address.zipcode,
            name: this.listingObject.address.name,
            state: this.listingObject.address.state,
            city: this.listingObject.address.city,
            country: this.listingObject.address.country,
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
  getThumb(image: string, size: number) {
    const src: string = image;
    const tmpName: string = src.substring(image.lastIndexOf('%2F') + 3);
    const aux: string = 'thumb@' + size + '_' + tmpName;

    return image.replace(tmpName, aux);
  }
  reviewInspection(approve: boolean) {
    this.isLoading = true;
    this.inspectionService.reviewInspection(this.listing, approve)
      .subscribe((result: object) => {
        this.isLoading = false;
        const that = this;
        setTimeout(function () {
          that.router.navigate(['/admin'], { replaceUrl: true });
        }, 1000);
      }, error => {
        this.isLoading = false;
      });
  }
  makeTrustedImage(item: any) {
    if (item) {
      const url = typeof item === 'string' ? item : item.content;
      const prefix = 'data:image/jpg;base64,';
      if (url && url.search('http') === -1) {
        const style = 'url(' + prefix + url + ')';
        return this.domSanitizer.bypassSecurityTrustStyle(style);
      } else {
        return `url(${url})`;
      }
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
  saveModel() {
    if (confirm(`Are you sure about adding the model ${this.listingObject.model} ` +
      `to the brand ${this.listingObject.brand}? This will impact on searching later.`)) {
      this.carsService.addModel(this.listingObject.brand, this.listingObject.model)
        .subscribe(() => {
          this.canSaveModel = false;
          this.brandsModels.find(brand => brand.key === this.listingObject.brand).models.push(this.listingObject.model);
        });
    }
  }
}
