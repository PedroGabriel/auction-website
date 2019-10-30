import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.component.html'
})
export class SeeAllComponent implements OnInit {
  version: string = environment.version;

  constructor() {}

  ngOnInit() {}
}
