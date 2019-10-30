import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ListingsService, UsersService, BidsService } from '@app/shared/api';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styles: [`
  a {
    color:black;
  }
  .profile-info-photo {

      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0;

      object-fit: cover;
      object-position: center right;
  }
  .buttons-rate-group {

    clear: both;
    display: block;
    position: relative;
    width: 100%;
    margin:0 0 30px 0;
    min-height: 100px;
  }
  .buttons-rate-group li {

    width: 48px;
    height: 100px;
    float: left;
    list-style: none;
    margin: 0px 15px;
    cursor: pointer;
    position: relative;
    background-image: url(assets/images/rating-icon.png);
    background-size: 200%;
    background-repeat: no-repeat;
    	background-position: 100% 20px;
  }
    .buttons-rate-group li:hover, .buttons-rate-group li.checked {
    background-position: 0 20px;
    }
  .buttons-rate-group li small {
    bottom: 0px;
    margin: auto;
    display: block;
    position: absolute;
    width: 100%;
    text-align: center;
    font-weight: bold;
    color: #666;
  }
  .frmReview {

    display: block;
    clear: both;
    position: relative;
  }
  .user-rate-group {

    clear: both;
    display: block;
    position: relative;
    width: 100%;
    margin:0 0 30px 0;
    min-height: 10px;
    padding: 0px;
  }
  .user-rate-group li {

    width: 23px;
    height: 40px;
    float: left;
    list-style: none;
    margin: 0 3px;
    cursor: pointer;
    position: relative;
    background-image: url(assets/images/rating-icon.png);
    background-size: 200%;
    background-repeat: no-repeat;
    background-position: 100% 0;
  }
 .user-rate-group li.checked {
    background-position: 0 0;
    }
  `]
})
export class ReviewComponent implements OnInit {
  version: string = environment.version;

  userId: string;
  currentUser: any;
  user: any;
  isLoading: boolean;
  review: any = {
    rating: 4,
    comment: ''
  };

  listingId: string;
  listing: any = {};
  frmReviewGroup: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.frmReviewGroup = this.formBuilder.group(
      {
        comment: []
      });
  }

  ngOnInit() {

    this.currentUser = this.authenticationService.user;
    let routeId: any;

    this.activatedRoute.params.subscribe(params => {
      routeId = params['listingId'];
    });


    if (routeId == null) {
      this.listingId = this.currentUser['id'];
    } else {
      this.listingId = routeId;
    }


    this.listingsService.get(this.listingId).subscribe((listing: any) => {
      this.isLoading = false;
      if (listing != null) {
        console.log(listing);
        this.listing = listing;
        if (listing.user != null) {
          this.usersService.get(listing.user.id, true).subscribe(user => {
            this.isLoading = false;
            this.listing.user = user;
          });
        }
      }
    });
  }
  getUserImage(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img && img.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + img);
    } else if (img) {
      return img;
    } else {
      return 'assets/images/user-photo-50x50.jpg';
    }
  }
  changeRating(rate: number) {
    this.review.rating = rate;
  }
  submit(modalSuccess: any) {
    const data: any = {
      comment: this.review.comment,
      stars: this.review.rating,
      listing: {
        id: this.listing.id
      },
      from: {
        id: this.currentUser.id
      },
      to: {
        id: this.listing.user.id
      }
    };

    this.usersService.sendReview(data).subscribe((res: any) => {
      this.review.comment = '';
      this.modalService.open(modalSuccess);
    });
  }
  makeTrustedImage(item: any) {
    const url = typeof item === 'string' ? item : item.content;
    const auxBase = 'data:image/jpg;base64,';
    if (url && url.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + url);
    } else if (url && url != null) {
      return url;
    } else {
      return this.listing.approval[0];
    }
  }
}

export class NgbdRatingBasic {
  currentRate = 8;
}
