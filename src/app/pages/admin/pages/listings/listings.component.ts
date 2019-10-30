import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ListingsService } from '@app/shared/api';
import { DateService } from '@app/shared/date.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styles: [
    `
  .item-edit-listing {

    z-index: 99999;
    display: block;
    position: absolute;
    right: 0px;
  }
  .box-car-item {
    min-width:360px;
  }
  `]
})
export class AdminListingsComponent implements OnInit, AfterViewChecked {
  listings: any;
  isLoading: boolean;
  currentTab: string;
  dateNow: number;
  listingsSlideInnerConfig = {
    lazyLoad: 'ondemand',
    infinite: false,
    arrows: true,
    dots: true
  };

  constructor(private listingsService: ListingsService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private dateService: DateService) { }

  ngOnInit() {
    this.changeTab('live');
    this.getListings();
  }
  getListings() {
    this.listings = {
      live: [{ loading: true }, { loading: true }, { loading: true }],
      closed: [{ loading: true }, { loading: true }, { loading: true }]
    };

    this.isLoading = true;
    this.listingsService.listByState('live').subscribe((listings: object) => {
      this.listings['live'] = listings;
      this.isLoading = false;
    });

    this.isLoading = true;
    this.listingsService.listByState('closed').subscribe((listings: object) => {
      this.listings['closed'] = listings;
      this.isLoading = false;
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

  changeTab(tab: string): boolean {
    this.currentTab = tab;
    return false;
  }
  clickListing(listingId: string): boolean {
    this.router.navigate(['/admin/edit-listing/' + listingId], { replaceUrl: true });
    return true;
  }
  closeListing(listingId: string) {
    this.isLoading = true;
    this.listingsService.edit(listingId, { state: 'closed' }).subscribe((response: object) => {
      this.getListings();
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }
  standbyListing(listingId: string) {
    this.isLoading = true;
    this.listingsService.edit(listingId, { state: 'approved', live: false })
      .subscribe(() => {
        this.getListings();
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
        alert('Some error occured with your request. Please try again later');
      });
  }
  openListing(listingId: string) {
    this.isLoading = true;
    this.listingsService.edit(listingId, { state: 'open' }).subscribe((response: object) => {
      this.getListings();
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }
}
