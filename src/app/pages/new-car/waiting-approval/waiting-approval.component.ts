import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';

@Component({
  selector: 'app-waiting-approval',
  templateUrl: './waiting-approval.component.html'
})
export class NewCarWaitingApprovalComponent implements OnInit {
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

    this.user = this.authenticationService.user;
    if (this.listing) {
      this.listingsService.get(this.listing, true).subscribe(listing => {
        this.listingObject = listing;

        if (listing['user']['id'] !== this['user']['id']) this.goToMain();

        if (!this.listingsService.checkState(listing['state'], ['pending'])) this.goToMain();

        if (!this.listingsService.checkAllowedRegisterStep(listing['registerStep'], 'waiting-approval'))
          this.goToMain();
      });
    }
  }

  goBack() {
    this.router.navigate(['/new-car/records/' + this.listing], { replaceUrl: true });
  }

  goToMain() {
    this.router.navigate(['/new-car/your-listing/'], { replaceUrl: true });
    return false;
  }
}
