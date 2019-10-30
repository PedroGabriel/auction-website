import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ListingsService, listingRegisterStepsLabel, listingRegisterStep } from '@app/shared/api';
import { DomSanitizer } from '../../../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-manage-listings',
  templateUrl: './manage-listings.component.html'
})
export class AdminManageListingsComponent implements OnInit {
  listings: any;
  isLoading: boolean;
  registerSteps: any;
  registerStepsLabel: any;

  constructor(private router: Router, private listingsService: ListingsService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.listings = [{ loading: true }, { loading: true }, { loading: true }];
    this.registerStepsLabel = listingRegisterStepsLabel;
    this.registerSteps = listingRegisterStep;

    this.isLoading = true;

    this.listingsService
      .listByStateOrderBy('requires admin', true, 'id')
      .subscribe((listings: object) => {
        this.isLoading = false;

        if (listings) {
          this.listings = listings;
        }
      });
  }

  registerStep(listing: object): number {
    return this.listingsService.checkRegisterStepNumber(listing['registerStep']);
  }

  clickListing(listingId: string): boolean {
    this.router.navigate(['/admin/edit-listing/' + listingId], { replaceUrl: true });
    return true;
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
