import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService, BidsService } from '@app/shared/api';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styles: [`
  .profile-info-photo {

      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0;

      object-fit: cover;
      object-position: center right;
  }
  .profile-public-actions {
    background: #f6f7f8
  }
  .row {
    width:100%;
  }
  .car-list-group {

    padding: 10px 30px;
  }
  .car-list-group h3 {
        font-size: 20px;
    font-weight: bold;
    margin: 10px 0 30px 0;
    padding: 0;
  }
  .car-list {

    border-radius: 15px;
    overflow: hidden;
    border: 1px solid #616161;
    margin-bottom:20px;
  }
  .car-list img {

    max-width: 330px;
    min-height: 222px;
  }
  .list-car-data {
    padding:30px 20px
  }
  .list-car-data span {
    color:#616161;
  }
  .list-car-data h3 {

    color: #ee506f;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .list-car-currentbid {
    margin-left:20px;
  }
  .titleinfobids {
    text-transform:uppercase;
    color: #616161;
    font-size: 1rem;
  }
  .list-car-currentbid .box-car-item-price, .box-car-item-qtd-bids{
      font-size: 20px;
      font-weight: bold;
      color: #404040;
      margin: 0;
      padding: 0;
      line-height: 26px;
  }
  .user-rate-group {

    clear: both;
    display: block;
    position: relative;
    width: 100%;
    margin:0 0 30px 0;
    min-height: 10px;
  }
  .user-rate-group li {
    width: 13px;
    height: 40px;
    float: left;
    list-style: none;
    margin: 0 3px;
    cursor: pointer;
    position: relative;
    background-image: url(assets/images/rating-icon.png);
    background-size: 200%;
    background-repeat: no-repeat;
      background-position: 100% 0px;
  }
 .user-rate-group li.checked {
    background-position: 0 0;
    }
    .profile-info .user-rate-group {

    clear: both;
    display: flex;
    position: relative;
    width: 100%;
    margin: 0 0 0 0;
    justify-content: center;
    min-height: 10px;
    padding: 0px;
    }
    .reviews-item-info .user-rate-group li {
      height:20px;
    }
    .reviews-item-info .user-rate-group {
    clear: both;
    display: block;
    position: relative;
    width: 100%;

    overflow: hidden;
    margin: 10px 0 0 -4px;
    padding: 0px;
    min-height: 10px;
    }
  `
  ]
})
export class AdminUserDetailComponent implements OnInit {
  currentTab = 'adminuserReviews';

  userId: string;
  user: any;
  isLoading: boolean;
  comments: any;
  bids: any = [];
  ratings: any = [];
  listings: any = {
    sold: [],
    bought: []
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private bidsService: BidsService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.comments = [];

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
    });

    if (this.userId) {
      this.isLoading = true;
      this.usersService.get(this.userId, true).subscribe(user => {
        this.isLoading = false;
        this.user = user;
      });
      this.usersService.comments(this.userId).subscribe(comments => {
        this.isLoading = false;
        this.comments = comments;
      });
      this.usersService.ratings(this.userId).subscribe((ratings: any) => {
        this.isLoading = false;


        for (let i = 0; i < ratings.length; i++) {
          const aux: any = ratings[i];
          if (aux.from != null) {
            this.usersService.get(aux.from.id, true).subscribe((user: any) => {
              this.isLoading = false;
              if (aux !== undefined) {
                aux.from = user;
              }
            });
          }
          this.ratings.push(aux);
        }
      });
      this.bidsService.list().subscribe((bids: any) => {
        this.isLoading = false;
        if (bids != null) {
          for (let i = 0; i < bids.length; i++) {
            if (bids[i].user != null && bids[i].user.id === this.userId) {
              this.bids.push(bids[i]);
            }
          }
        }
      });
      this.listingsService.list().subscribe((listings: any) => {
        this.isLoading = false;
        if (listings != null) {
          for (let i = 0; i < listings.length; i++) {
            if (listings[i].user != null && listings[i].user.id === this.userId) {
              this.listings.sold.push(listings[i]);
            }
          }
        }
      });
    }

  }

  changeTab(tab: string): boolean {
    this.currentTab = tab;
    return false;
  }

  getImage(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + img);
    } else {
      return img;
    }
  }
  getUserImage(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img != null && img.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + img);
    } else {
      return img !== undefined ? img : 'assets/images/user-photo-50x50.jpg';
    }
  }
  async disableUser(user: any) {
    if (user != null) {
      const token = await this.authenticationService.authService.setToken();
      localStorage.setItem('_token', token);
      this.isLoading = true;
      this.usersService.disable(user.id, !user.disabled).subscribe((u: any) => {
        this.isLoading = false;
        this.user.disabled = !user.disabled;
      });
    }
  }
  deleteComment(comment: any, listing: string, i: number) {
    if (comment != null) {
      this.isLoading = true;
      this.listingsService.deleteComment(comment, listing).subscribe((res: any) => {
        this.isLoading = false;
        this.comments.splice(i, 1);
      });
    }
  }
  makeTrustedImage(listing: any, item: any) {
    const url = typeof item === 'string' ? item : item.content;
    const auxBase = 'data:image/jpg;base64,';
    if (url && url.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + url);
    } else if (url && url != null) {
      return url;
    } else {
      return listing.approval[0];
    }
  }
}
