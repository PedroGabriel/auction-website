import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-listing-approved',
  templateUrl: './listing-approved.component.html'
})
export class NewCarListingApprovedComponent implements OnInit {
  version: string = environment.version;

  constructor() {}

  ngOnInit() {}
}
