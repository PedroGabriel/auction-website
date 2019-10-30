import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approval-listing',
  templateUrl: './approval-listing.component.html'
})
export class AdminApprovalListingComponent implements OnInit {
  currentTab = 'adminuserReviews';

  constructor() {}

  ngOnInit() {}

  changeTab(tab: string): boolean {
    this.currentTab = tab;
    return false;
  }
}
