/// <reference types="@types/googlemaps" />

import {
  NgZone,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  Component,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { MapsAPILoader } from '@agm/core';
import * as $ from 'jquery';
import { SlickModule } from 'ngx-slick';
import { ListingsService, CarsService } from '@app/shared/api';
import { DateService } from '@app/shared/date.service';
import { Options, LabelType } from 'ng5-slider';
import { CriaturoEvtService } from '../../criaturo/criaturo-evt.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [`
  .input-group-prepend {
    height: 38px;
    margin-top: 10px;
  }
   h4.error {

    width: 100%;
    text-align: center;
    padding: 40px 20px;
  }
  .box-error {
    width:100%;
  }
  .box-error i {

    font-size: 50px;
    color: #f05b7a;
    margin-bottom: -20px;
    display: block;
    padding: 0px;
  }
  .price-filter-box {

    width: 200px;
    position: absolute;
    left: -35px;
    background: #fff;
    padding: 20px;
    border: 1px solid #ddd;
      z-index:999;
  }
    .price-filter-box  input {
      display:block !important;
    padding: 5px 10px;
    border-radius: 3px;
    border: solid 1px #dbdbdb;
     max-width: 100%;
      margin-top: 10px;
    }
  `]
})
export class SearchComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('priceBox')
  priceBox: ElementRef;
  @ViewChild('priceButton')
  priceButton: ElementRef;
  latitude: number;
  longitude: number;
  autoCompleteControl: FormControl;
  zoom: number;
  locations: any;

  isLoading = false;
  listings: any;
  brands: any;
  brandsModels: any;
  currentBrand: string;
  searchParams: any;
  showPriceFilter = false;

  dateNow: number;

  // Sliding range
  minPrice = 0;
  maxPrice = 1000000;
  options: Options;
  isFirstTime: boolean;
  firstLoad = false;
  // slider
  listingsSlideInnerConfig = {
    lazyLoad: 'ondemand',
    infinite: true,
    arrows: true,
    dots: true
  };

  currentYear = new Date().getFullYear();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private slickModule: SlickModule,
    private dateService: DateService,
    private listingsService: ListingsService,
    private evtService: CriaturoEvtService,
    private carsService: CarsService
  ) {
    this.options = {
      floor: 0,
      ceil: this.maxPrice,
      translate: (value: number): string => {
        return '$' + value;
      },
      combineLabels: (minPrice: string, maxPrice: string): string => {
        return minPrice + ' ' + maxPrice;
      }
    };
  }

  ngOnInit() {
    this.brands = [];
    this.brandsModels = {};
    this.currentBrand = '';
    this.carsService
      .get()
      .subscribe((cars: any) => {
        if (cars.brands) {
          this.brands = cars.brands;
          delete cars.brands;
          this.brandsModels = cars;

          this.brands.sort(function (a: any, b: any) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
          });
        }
      });

    this.listings = [];

    this.zoom = 6;
    this.latitude = 39.95569810000001;
    this.longitude = -75.18194749999998;

    if ($('[data-header-latitude]').val()) {
      this.latitude = Number($('[data-header-latitude]').val());
      $('[name="latitude"][data-search]').val(this.latitude);
    }

    if ($('[data-header-longitude]').val()) {
      this.longitude = Number($('[data-header-longitude]').val());
      $('[name="longitude"][data-search]').val(this.longitude);
    }

    // if ($('[data-header-latitude]').val() || $('[data-header-longitude]').val()) {
    //   this.zoom = 14;
    // }

    const that = this;
    // search loading
    // this.doSearch();

    // dropdown buttons
    $('.dropdown').on('click', function () {
      $('.dropdown').not(this).each(function () {
        $('.dropdown-menu', this).hide();
      });
      $(this).find('.dropdown-menu').toggle();
    });
    $('.dropdown .dropdown-menu a').on('click', function () {
      const val = $(this).attr('data-value');

      const menu = $(this).closest('.dropdown-menu');
      const button = menu.siblings('button');
      const input = menu.siblings(':input');

      input.val(val).trigger('change');
      // that.doSearch();
      menu.hide();
      if (val) {
        button.text(val);
        button.addClass('active');
      } else {
        button.text(button.attr('data-text'));
        button.removeClass('active');
      }
      return false;
    });
    $(document).on('click', (e: any) => {
      if (!$(e.target).is('.dropdown, .dropdown *')) {
        $('.dropdown .dropdown-menu').hide();
      }
    });

    $('.input-search').on('change', function () {
      const text = $('.input-search').val();
      const lat = $('.input-search-lat').val();
      const lng = $('.input-search-lng').val();
      that.changeLocation(lat, lng);
    });

    // $('.search-results [name="longitude"]').on('change',function(){
    //   that.doSearch();
    // });

  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.priceBox) {
      if (this.priceBox.nativeElement.contains(event.target)) {
        this.showPriceFilter = true;
      } else if (this.showPriceFilter && !this.priceButton.nativeElement.contains(event.target)) {
        this.showPriceFilter = false;
      }
    }
  }

  range = (start: number, stop: number, step: number = 1) =>
    Array(Math.ceil((stop + 1 - start) / step))
      .fill(start)
      .map((x, y) => x + y * step)
      .reverse()

  mapReady(map: any) {
    const that = this;

    map.addListener('dragend', function () {
      $('[name="latitude"]').val(map.center.lat());
      $('[name="longitude"]').val(map.center.lng());
      // that.doSearch();
    });
    map.addListener('zoom_changed', function () {
      that.zoom = map.zoom;
      // that.doSearch();
    });

  }
  ngAfterViewInit() {
    if (this.evtService.event$ !== undefined) {
      this.evtService.event$.subscribe((evt: any) => {
        this.listings = [];
        this.searchParams = evt.data;

        switch (this.searchParams.type) {
          case 'brand':
            $('[name="brand"]').val(evt.data.brand);
            $('[name="searchHeader"]').val(evt.data.brand);
            break;
          case 'location':
            $('[name="latitude"]').val(evt.data.address);
            $('[name="searchHeader"]').val(evt.data.address);
            break;
        }
        this.doSearch();
      });
    }
    this.route.queryParams.subscribe((params: any) => {
      this.listings = [];
      try {
        this.searchParams = JSON.parse(atob(params['q']));
      } catch (e) {
        this.searchParams = {};
      }
      if (this.searchParams) {
        switch (this.searchParams.type) {
          case 'brand':
            $('[name="searchHeader"]').val(this.searchParams.brand);
            break;
          case 'location':
            $('[name="searchHeader"]').val(this.searchParams.address);
            break;
        }
      }
      this.currentBrand = '';
      this.isFirstTime = true;
      this.isLoading = false;
      this.doSearch();
    });
  }
  goToListing(id: string) {
    window.open('/bid-detail/' + id);
  }

  doSearch() {
    if (!this.isLoading) {
      this.ngZone.run(() => {
        this.listings = [];
        this.isLoading = true;

        if (!this.firstLoad) {
          this.firstLoad = true;
        }

        const data = {};
        const qs = $(':input[name][data-search]').serializeArray();
        $(qs).each(function (index: number, obj: any) {
          if (obj.value) {
            data[obj.name] = obj.value;
          }
        });

        data['status'] = 'live';
        if (this.currentBrand !== '' && !this.isFirstTime) {
          data['brand'] = this.currentBrand;
        } else if (this.searchParams !== undefined && this.searchParams.brand !== undefined) {
          data['brand'] = this.searchParams.brand;
          this.changeBrand(this.searchParams.brand);
        }


        if (this.searchParams.latitude !== undefined && this.searchParams.longitude !== undefined) {
          data['latitude'] = this.searchParams.latitude;
          data['longitude'] = this.searchParams.longitude;
        }
        if (data['latitude'] && data['longitude']) {
          // data['latitude'] = data['latitude'].toString().slice(0,9);
          // data['longitude'] = data['longitude'].toString().slice(0,9);
          switch (this.searchParams.address) {
            case 'United States':
              data['radius'] = 60000000;
              this.zoom = 3;
              break;
            case 'USA':
              data['radius'] = 60000000;
              this.zoom = 3;
              break;
            default:
              data['radius'] = 60;
              this.zoom = 10;
              break;
          }
          this.changeLocation(data['latitude'], data['longitude'], this.zoom);
          // data['radius'] = (100000*17)/(this.zoom/1.2);
        }
        if (this.minPrice !== undefined && this.maxPrice !== undefined) {
          data['minPrice'] = this.minPrice;
          data['maxPrice'] = this.maxPrice;
        }

        this.listings = [];
        this.listingsService
          .search(data, true)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe((listings: any[]) => {
            this.initLocations();
            if (listings && typeof listings === typeof []) {
              this.listings = [];
              console.log(this.searchParams);
              for (const list of listings) {
                if (this.searchParams.address && this.searchParams.address !== 'USA' &&
                  this.searchParams.address !== 'United States') {
                  if (this.searchParams.address.search(list.address.city) !== 1 &&
                    this.searchParams.address.search(list.address.state) !== -1) {
                    this.setLocations(list.address);
                    this.listings.push(list);
                  }
                } else if (this.searchParams.address === 'USA' || this.searchParams.address === 'United States') {
                  if (list.address.country === 'US') {
                    this.listings.push(list);
                  }
                } else {
                  this.listings.push(list);
                }
              }

              if (this.listings[0] !== undefined) {
                this.latitude = this.listings[0].address.location._latitude;
                this.longitude = this.listings[0].address.location._longitude;

              }
              if (this.isFirstTime) {
                const prices = listings.map(listing => listing.price);
                this.isFirstTime = false;
              }
            } else {
              this.listings = [];
            }
            if (Object.keys(this.locations.city).length >= 1 && Object.keys(this.locations.state).length === 1) {
              this.zoom = 13;
            } else if (Object.keys(this.locations.city).length >= 1 && Object.keys(this.locations.state).length > 1) {
              this.zoom = 13;
            }
          });
      });
    }
  }
  initLocations() {
    this.locations = {
      state: {},
      city: {}
    };
  }
  setLocations(address: any) {
    if (!this.locations.state[address.state] && !this.locations.state[address.city]) {
      this.locations.state[address.state] = true;
      this.locations.city[address.city] = true;
    }
  }
  changeLocation(lat: any, lng: any, zoom?: any) {
    this.latitude = lat;
    this.longitude = lng;
    if (zoom) {
      this.zoom = zoom;
    }
  }

  changeBrand(brand: string) {

    this.ngZone.run(() => {
      this.isFirstTime = false;
      this.currentBrand = brand;
      this.changeModel('');

      const input: any = $('[name="brand"]');
      const button: any = input.siblings('button');
      input.val(brand).trigger('change');
      $('body').trigger('click tap');

      if (brand) {
        button.text(brand);
        button.addClass('active');
      } else {
        button.text(button.attr('data-text'));
        button.removeClass('active');
      }

      if (this.brandsModels[this.currentBrand] !== undefined) {
        this.brandsModels[this.currentBrand].sort(function (a: any, b: any) {
          if (a < b) { return -1; }
          if (a > b) { return 1; }
          return 0;
        });
      }

      setTimeout(() => {
        if (!this.isLoading) {
          this.doSearch();
        }
      },
        300);
      return false;
    });
  }

  changeModel(model: string) {
    this.ngZone.run(() => {
      const input = $('[name="model"]');
      const button = input.siblings('button');

      input.val(model).trigger('change');
      $('body').trigger('click tap');

      if (model) {
        button.text(model);
        button.addClass('active');
      } else {
        button.text(button.attr('data-text'));
        button.removeClass('active');
      }

      setTimeout(() => {
        if (!this.isLoading) {
          this.doSearch();
        }
      },
        300);
      return false;
    });
  }

  changeYear(year: string) {
    this.ngZone.run(() => {
      const input = $('[name="year"]');
      const button = input.siblings('button');

      input.val(year).trigger('change');
      $('body').trigger('click tap');

      if (year) {
        button.text(year);
        button.addClass('active');
      } else {
        button.text(button.attr('data-text'));
        button.removeClass('active');
      }

      setTimeout(() => {
        if (!this.isLoading) {
          this.doSearch();
        }
      },
        300);
      return false;
    });
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
  togglePriceFilter() {
    this.showPriceFilter = this.showPriceFilter ? false : true;
  }
  changedPriceFilter() {
    if (!this.isLoading) {
      this.doSearch();
      this.togglePriceFilter();
    }
  }
  getThumb(image: string, size: number) {
    const src: string = image;
    const tmpName: string = src.substring(image.lastIndexOf('%2F') + 3);
    const aux = `thumb${size}@_${tmpName}`;

    return image.replace(tmpName, aux);
  }
}
