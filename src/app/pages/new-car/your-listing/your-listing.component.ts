import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UsersService, ListingsService, listingRegisterStepsLabel, listingRegisterStep } from '@app/shared/api';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-your-listing',
  templateUrl: './your-listing.component.html'
})
export class NewCarYourListingComponent implements OnInit {
  listings: any[];
  registerSteps: any;
  registerStepsLabel: any;

  constructor(
    private router: Router,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.listings = [{ loading: true }, { loading: true }, { loading: true }];
    this.registerStepsLabel = listingRegisterStepsLabel;
    this.registerSteps = listingRegisterStep;

    this.getListings();
  }

  getListings() {
    this.usersService.listings(null, true).subscribe((response: any) => {
      if (typeof response === typeof '') {
        this.listings = [];
      } else {
        this.listings = response;
      }
    });
  }

  registerStep(listing: object): number {
    return this.listingsService.checkRegisterStepNumber(listing['registerStep']);
  }

  carClick(car: any, action: string) {
    if (!car || !car.id) {
      return false;
    }

    if (car.state === 'live') {
      if (action !== 'close' && action !== 'standby') {
        this.router.navigate(['/bid-detail/' + car.id], { replaceUrl: true });
        return true;
      }
      if (action === 'close') {
        // this.router.navigate(['/add-car/your-listing'], { replaceUrl: true });
        return true;
      }
      if (action === 'standby') {
        this.listingsService.edit(car.id, { state: 'approved', live: false })
          .subscribe(() => {
            car.state = 'approved';
          }, error => {
            console.log(error);
            alert('Some error occured with your request. Please try again later');
          });
      }
    } else {
      if (action && action === 'delete') {
        if (confirm('Are you sure about deleting this auction?')) {
          this.listingsService.delete(car.id)
            .subscribe(() => {
              this.listings = this.listings.filter(listing => listing['id'] !== car.id);
            }, error => {
              alert('Some error occured with your request. Please try again later');
            });
        }
      } else {
        switch (car.state) {
          case 'pre-approval rejected':
            this.router.navigate(['/new-car/basic-information/' + car.id], { replaceUrl: true });
            break;
          case 'approval rejected':
            this.router.navigate(['/new-car/additional-information/' + car.id], { replaceUrl: true });
            break;
          default:
            if (car.registerStep !== 'complete') {
              this.router.navigate(['/new-car/' + car.registerStep + '/' + car.id], { replaceUrl: true });
              return true;
              break;
            }
        }
      }
    }
  }

  makeTrustedImage(listing: any, item: any) {
    if (item) {
      const url = typeof item === 'string' ? item : item.content;
      const auxBase = 'data:image/jpg;base64,';
      if (url && url.search('http') === -1) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + url);
      } else if (url && url != null) {
        return url;
      } else {
        return listing.approval[0];
      }
    } else {
      return listing.approval[0];
    }
  }

}
