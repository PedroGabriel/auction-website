import { Component, OnInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ListingsService, CarsService } from '@app/shared/api';
import { AuthenticationService } from '@app/core';
import { MapsAPILoader } from '@agm/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styles: [`
    form {
      width:100%;
      position:relative;
    }
    .ng-touched.ng-invalid {
      border-color:red;
    }
    button[disabled] {
      opacity:.6
    }
    .error-message {
          color: red;
    font-size: 12px;
    }
    .errorBox {
    margin: 10px;
    padding: 10px;
    border: 1px solid #f05b7a;
    border-radius: 4px;
    color: #f05b7a;
    background: #ffe6eb;
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
  `]
})
export class NewCarBasicInformationComponent implements OnInit {
  user: any;

  listing: string; // param
  listingObject: any;
  isLoading: boolean;
  createListingsForm: FormGroup;
  brandsModels: any[];
  showFirst = false;
  submitted = false;
  invalidAddress: boolean;
  addressChanged: boolean;
  showFormError = false;
  latitude: number;
  longitude: number;
  firstSearch = true;
  isSearching:boolean = false; 
  @ViewChild('address')
  searchElementRef: ElementRef;
  searchData: any = {
    places: [],
    brands: [],
    input: ''
  };

  validationMsg: any;
  formData: any = {
    year: '',
    brand: '',
    model: '',
    reservePriceCheck: '',
    reservePrice: '',
    yearsOwned: '',
    owners: '',
    vin: '',
    saleReason: '',
    roadworthy: '',
    accidents: '',
    issues: '',
    address_zipcode: '',
    address_name: '',
    address_state: '',
    address_city: '',
    address_country: '',
    address: ''
  };
  showSearchGroup = false;

  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private listingsService: ListingsService,
    private carsService: CarsService,
    private authenticationService: AuthenticationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.createListingsForm = this.formBuilder.group({
      year: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      reservePriceCheck: ['', Validators.required],
      reservePrice: [''],
      yearsOwned: ['', Validators.required],
      owners: ['', Validators.required],
      vin: ['', Validators.required],
      saleReason: ['', Validators.required],
      roadworthy: ['', Validators.required],
      accidents: ['', Validators.required],
      issues: [''],
      address_zipcode: ['', Validators.required],
      address_name: ['', Validators.required],
      address_state: ['', Validators.required],
      address_city: ['', Validators.required],
      address_country: ['', Validators.required],
      address: [''],
      mileage: ['', Validators.required],
      mileageUnit: ['', Validators.required],
    });
    this.validationMsg = {
      'year': [
        { type: 'required', message: 'You must select a year.' }
      ],
      'brand': [
        { type: 'required', message: 'You must select a brand.' }
      ],
      'model': [
        { type: 'required', message: 'You must select a model.' }
      ],
      'yearsOwned': [
        { type: 'required', message: 'Years owned is required.' }
      ],
      'owners': [
        { type: 'required', message: 'Number of owners is required.' }
      ],
      'roadworthy': [
        { type: 'required', message: 'Roadworthy is required.' }
      ],
      'accidents': [
        { type: 'required', message: 'Accidents selection is required.' }
      ],
      'saleReason': [
        { type: 'required', message: 'A sale reason is required.' }
      ],
      'mileage': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'mileageUnit': [
        {
          type: 'required',
          message: 'This field is required'
        }],
    };
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: any) {
    if (event != null) {
      if (event.target !== undefined && event.target.localName !== undefined &&
        event.target.localName !== 'input' && event.target.localName !== 'textarea') {
        switch (event.key) {
          case 'ArrowLeft':
            this.showFirst = false;
            break;
          case 'ArrowRight':
            this.showFirst = true;
            break;
        }
      }
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createListingsForm.controls;
  }

  range = (start: number, stop: number, step: number = 1) =>
    Array(Math.ceil((stop + 1 - start) / step))
      .fill(start)
      .map((x, y) => x + y * step)
      .reverse()

   startListing() {

    const save = this.createListingsForm.value;
    save.user = this.user;
    save.address = {};
    save['registerStep'] = 'basic-information';
    save['state']       = "pending";
    save['reservePrice'] = 0;

    this.toggleLoading(true);
      this.listingsService
        .create(save)
        .subscribe((response: object) => {
          this.toggleLoading(false);
        });
   }
  ngOnInit() {
    this.showSearchGroup = false;
    this.toggleLoading(false);
    this.invalidAddress = false;
    this.addressChanged = false;

    this.route.params.subscribe(params => {
      this.listing = params['listing'];
    });

    if (this.listing) {
      this.isLoading = true;
      this.listingsService.get(this.listing, true).subscribe((listing: any) => {
        if (listing != null) {
          this.createListingsForm.patchValue({
            year: listing.year,
            brand: listing.brand,
            model: listing.model,
            reservePriceCheck: listing.reservePriceCheck,
            reservePrice: listing.reservePrice,
            yearsOwned: listing.yearsOwned,
            owners: listing.owners,
            vin: listing.vin,
            saleReason: listing.saleReason,
            roadworthy: listing.roadworthy,
            accidents: listing.accidents,
            issues: listing.issues,
            address_zipcode: listing.address.zipcode,
            address_name: listing.address.name,
            address_state: listing.address.state,
            address_city: listing.address.city,
            address_country: listing.address.country,
            address: listing.address.name,
            mileage: listing.mileage
          });
        }
        this.invalidAddress = false;
        this.addressChanged = true;
        this.isLoading = false;
      });
    }
    // else {
    //   this.startListing();
    // }
    this.brandsModels = [];
    this.carsService
      .get()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((cars: any) => {
        if (cars.brands !== undefined) {
          const i = 0, limit = 7;

          for (const obj of cars.brands) {
            if (this.brandsModels !== undefined) {
              this.brandsModels.push({ key: obj, models: cars[obj] });
            }

          }
          this.brandsModels = this.brandsModels.sort((a, b) => a.key.localeCompare(b.key));
          console.log(this.brandsModels);
        }
      });
    this.user = this.authenticationService.user;

    // autocomplete
    this.mapsAPILoader.load().then(() => {
      const options = {
        types: ['(regions)']
      };
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
      autocomplete.setComponentRestrictions({ 'country': 'us' });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
        });
      });
    });
  }
  getSelectedModels() {
    for (const item of this.brandsModels) {
      if (item.key === this.createListingsForm.value.brand) {
        return item.models;
      }
    }
    return [];
  }
  selectPlace(query: any) {
    this.ngZone.run(() => {
      this.toggleLoading(true);
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
          // this.formData.address_zipcode = zipcode;
          // this.formData.address_name = address;
          // this.formData.address_state = state;
          // this.formData.address_country = country;
          // this.formData.address_city = city;
          this.f['address_zipcode'].setValue(zipcode);
          this.f['address_name'].setValue(address);
          this.f['address_state'].setValue(state);
          this.f['address_country'].setValue(country);
          this.f['address_city'].setValue(city);
          this.addressChanged = true;
          if (!zipcode || !state || !city || !country) {

            this.invalidAddress = true;
            return;
          }
          this.invalidAddress = false;
          this.toggleLoading(false);
          this.showSearchGroup = false;

        });

        this.searchData.input = res[0].formatted_address;
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.toggleLoading(false);
      });
    });
  }
  querySearch(evt?: Event) {
    this.isSearching = true;
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
        this.isSearching = false;
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
  onSubmit() {
    const requiredSteps: any = [
      'year',
      'brand',
      'model',
      'yearsOwned',
      'owners',
      'roadworthy',
      'accidents',
      'saleReason',
      'mileage',
      'mileageUnit'
    ];
    let count = 0;

    if (this.createListingsForm.invalid) {
      Object.keys(this.createListingsForm.controls).forEach(key => {

        const controlErrors: ValidationErrors = this.createListingsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            this.createListingsForm.controls[key].markAsTouched();
            for (const item of requiredSteps) {
              if (item === key) {
                count++;
              }
            }
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      if (this.showFirst) {
        if (this.createListingsForm.valid) {
          this.submitted = true;
          this.createListing();
        } else {
          this.showFormError = true;
          this.showFirst = !this.showFirst;
        }
      } else {
        console.log(count);
        if (count === 0) {
          this.toggle();
          this.showFormError = false;
        } else {
          if(this.searchData.input != '')
            this.showSearchGroupToggle();
          else
            this.showFormError = true;
        }
      }
    } else {
      this.submitted = true;
      this.createListing();
    }

  }

  createListing() {
    const save = this.createListingsForm.value;
    save.user = this.user;
    save.address = {};
    if (save['address_zipcode']) {
      save.address['zipcode'] = save['address_zipcode'];
      delete save['address_zipcode'];
    }
    if (save['address_name']) {
      save.address['name'] = save['address_name'];
      delete save['address_name'];
    }
    if (save['address_state']) {
      save.address['state'] = save['address_state'];
      delete save['address_state'];
    }

    if (save['address_city']) {
      save.address['city'] = save['address_city'];
      delete save['address_city'];
    }
    if (save['address_country']) {
      save.address['country'] = save['address_country'];
      delete save['address_country'];
    }

    if (this.latitude && this.longitude) {
      save.address.location = {
        _latitude: this.latitude,
        _longitude: this.longitude,
      };
    }

    save['year'] = parseInt(save['year'], 10);
    if (!save['reservePrice']) {
      save['reservePrice'] = 0;
    } else {
      Number(save['reservePrice']);
    }

    if (!save['reservePrice']) {
      save['reservePrice'] = 0;
    }

    if (save['model']) {
      save['model'] = save['model'].toString().trim();
    }

    save['registerStep'] = 'basic-photo';
    this.toggleLoading(true);
    if (!this.listing) {
      this.listingsService
        .create(save)
        .subscribe((response: object) => {
          this.toggleLoading(false);
          if (response && response['id']) {
            this.router.navigate(['/new-car/basic-photo/' + response['id']], { replaceUrl: true });
            this.finalizeForm(true);
          }
        });
    } else {
      this.listingsService
        .edit(this.listing, save)
        .subscribe((response: object) => {
          this.toggleLoading(false);
          if (response) {
            this.router.navigate(['/new-car/basic-photo/' + this.listing], { replaceUrl: true });
            this.finalizeForm(true);
          }
        });

    }
  }


  toggle() {
    if (this.showFirst === false) {
      this.showFirst = true;
    } else {
      this.showFirst = false;
    }
  }

  finalizeForm(clear?: boolean) {
    this.createListingsForm.markAsPristine();
    if (clear) {
      this.createListingsForm.reset();
    }
  }
  toggleStep(val: boolean) {
    this.showFirst = val;
  }
  showSearchGroupToggle(evt?:any) {
    this.showSearchGroup = true;

    if(evt && !this.isSearching){
      setTimeout(() => {
        this.querySearch(evt);
      },
        2000)
    }
    
  }
  closeSearchGroup() {
    setTimeout(() => { this.showSearchGroup = false; }, 1000);
  }

  toggleLoading(val: boolean) {
    this.isLoading = val;
    this.closeSearchGroup();
  }
  changedSelect(evt: any, model: string) {
    this.createListingsForm.controls[model].setValue(evt);
  }
}
