import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';
@Component({
  selector: 'app-waiting-approval-final',
  templateUrl: './waiting-approval-final.component.html'
})
export class NewCarWaitingApprovalFinalComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.listing = params['listing'];
    });
  }
}
