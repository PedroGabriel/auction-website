import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import * as $ from 'jquery';
import { AuthenticationService } from '@app/core';

import { SlickModule } from 'ngx-slick';
import { ListingsService, CarsService, UsersService } from '@app/shared/api';
import * as moment from 'moment';

import { CriaturoEvtService } from '../../criaturo/criaturo-evt.service';
import { DateService } from '@app/shared/date.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
.pac-container{
  display:none !important;
  width:0px !important;
  z-index:-9999 !important;
  height:0px;
  position:fixed;
  bottom:0px;
  left:0px;
}

  `]
})
export class HomeComponent implements OnInit, AfterViewChecked {
  listings: object;
  brands: Array<any>;
  following: Array<any> = [];
  listingsEnding: Array<any>;
  isLoading: boolean;
  user: any;
  isAuth:boolean = false;
  dateNow: number;

  searchData: any = {
    places: [],
    brands: [],
    input: ''
  };

  showSearchGroup = true;

  listingsSlideConfig = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 961,
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
    infinite: false,
    arrows: true,
    dots: true
  };

  latitude: number;
  longitude: number;
  @ViewChild('searchHome')
  searchElementRef: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private listingsService: ListingsService,
    private authenticationService: AuthenticationService,
    private carsService: CarsService,
    private dateService: DateService,
    private slickModule: SlickModule,
    private http: HttpClient,
    private usersService: UsersService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private evtService: CriaturoEvtService
  ) { }

  getBrands() {
    this.brands = [];
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
            if (this.brands !== undefined) {
              this.brands.push(obj);
            }

          }
        }
      });
  }
  setAuthenticated() {
    this.isAuth = this.authenticationService.isAuthenticated();
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

      this.user = this.authenticationService.user;
      if (!this.checkFollowing(id)) {
        this.listingsService
          .follow(id, this.user)
          .pipe(
            finalize(() => {
            })
          )
          .subscribe((res: any) => {
            this.getFollowing();
          });
      } else {
        this.listingsService
          .unfollow(id, this.user)
          .pipe(
            finalize(() => {
            })
          )
          .subscribe((res: any) => {
            this.getFollowing();
          });
      }
    });
  }
  ngOnInit() {
    this.listings = [{ loading: true }, { loading: true }, { loading: true }];

    this.user = this.authenticationService.user;
    this.setAuthenticated();
    this.listingsEnding = [];


    if (this.evtService.event$ !== undefined) {
      this.evtService.event$.subscribe((evt: any) => {
        switch (evt.name) {
          case 'logged-in':
            this.setAuthenticated();
            this.getFollowing();
            break;
        }
      });
    }

    this.getBrands();
    this.getFollowing();
    this.isLoading = true;
    this.listingsService
      .listByState('live')
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((listings: object) => {
        this.listings = listings;
      });

    this.listingsService
      .listByStateOrderBy('live', false, 'timestamp')
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((listings: any[]) => {
        for (const obj of listings) {
          this.listingsEnding.push(obj);
        } 
        this.listingsEnding.sort((x, y) => {
          return x.timestamp._seconds - y.timestamp._seconds;
        });
      });

  }

  brandSearch() {
    this.searchData.brands = [];
    const tmpBrands: any = this.brands, data: any = this.searchData.input;
    if (data !== '' && tmpBrands !== undefined) {
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
    const placesService = new google.maps.places.AutocompleteService();
    placesService.getPlacePredictions({
      input: this.searchData.input,
      componentRestrictions: { country: 'us' },
      types: ['(regions)']
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.searchData.places = results.map(place => place.description);
      }
    });
  }

  ngAfterViewChecked() {
    this.dateNow = Date.now() / 1000;
    this.cdRef.detectChanges();
  }

  checkAboutToEnd(time:any) {

    let nextTen:any = moment(new Date()),
        data:any = moment.unix(time + (60 * 60 * 24 * 21));
    
    return data.diff(nextTen, 'hours') <= 24;
  }
  checkAvailableAuction(time:any) {

    let nextTen:any = moment(new Date()).add(10, 'days'),
        today:any = moment(new Date()),
        data:any = moment.unix(time + (60 * 60 * 24 * 21)); 
    return nextTen.diff(data, 'days') <= 10 && data.diff(today, 'days') >= 1;
  }
  timeLeft(current: number): number { 

    return current + (60 * 60 * 24 * 21);
  }

  percentage(current: number): number {
    return this.dateService.percentage(current, this.dateNow);
  }

  search(searchParams?: any) {
    this.isLoading = true;
    $(`[name='searchHeader']`).val($(`[name='searchHome']`).val());

    const navigationExtras: NavigationExtras = {
      queryParams: { 'q': btoa(JSON.stringify(searchParams)) },
      replaceUrl: true
    }; 

    this.router.navigate(['search'], navigationExtras);
    return false;
  }

  querySearch(evt?: Event) {
    this.searchData.brands = [];
    this.searchData.places = [];
    if (this.searchData.input !== '') {
      this.showSearchGroup = true;
      this.brandSearch();
      this.placeSearch();
    } else {
      this.showSearchGroup = false;
    }
  }

  doSearchListings(query: any) {
    $(() => {
      this.ngZone.run(() => {
        $('.pac-container').css('z-index', '-999999');
      });
    });
    this.brandSearch(); 
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
  selectPlace(item: any) {
    const service: any = new google.maps.places.PlacesService(document.createElement('div')),
      request = {
        query: item
      };

    service.textSearch(request, (res: any) => {
      this.searchData.input = res[0].formatted_address; 
      const searchParams: any = {
        latitude: res[0].geometry.location.lat(),
        longitude: res[0].geometry.location.lng(),
        address: res[0].formatted_address,
        type: 'location'
      };
      this.search(searchParams);
    });
  }
  getThumb(image: string, size: number) {
    const src: string = image;
    const tmpName: string = src.substring(image.lastIndexOf('%2F') + 3);
    const aux: string = 'thumb@' + size + '_' + tmpName;

    return image.replace(tmpName, aux);
  }
}

