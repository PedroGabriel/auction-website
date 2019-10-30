import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html'
})
export class NewCarInspectionComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;

  constructor() {}

  ngOnInit() {}
}
