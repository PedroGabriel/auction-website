import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@app/core';
import { finalize } from 'rxjs/operators';
import { ListingsService, UsersService, BidsService } from '@app/shared/api';
import { DomSanitizer } from '@angular/platform-browser';
import { CriaturoEvtService } from '../../criaturo/criaturo-evt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [`
  .nav-item {
    width: 20% !important;
  }
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
    .following-thumb-group {
      position:relative;
    }
  `
  ]
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  currentTab = 'adminuserReviews';

  userId: string;
  currentUser: any;
  user: any;
  isLoading: boolean;
  comments: any;
  bids: any[] = [];
  following: Array<any> = [];
  ratings: any[] = [];
  listings: any = {
    bought: [],
    sold: []
  };
  frmContactData: any = {
    message: ''
  };
  @ViewChild('modalContactOwner') private modalContactOwner: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private bidsService: BidsService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private ngZone: NgZone,
    private evtService: CriaturoEvtService
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.initProfileDetails();


  }
  getFollowing() {
    this.following = [];
    this.usersService
      .getFollowing()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((cars: any) => {
        if (cars != null) {
          for (const item of cars) {
            if (item != null) {
              this.listingsService.get(item.listing.id, true).subscribe((car: any) => {
                this.following.push(car);
              });
            }
          }
        }
      });
  }
  initProfileDetails() {

    this.isLoading = false;
    this.comments = [];

    this.currentUser = this.authenticationService.user;

    let routeId: any;

    this.activatedRoute.params.subscribe(params => {
      routeId = params['userId'];
    });
    if (routeId == null) {
      this.userId = this.currentUser['id'];
    } else {
      this.userId = routeId;
    }

    this.userId = this.userId.replace(' ', '');

    console.log(this.currentUser.id);
    console.log(this.userId);

    if (this.userId) {
      this.isLoading = true;
      this.getFollowing();
      this.usersService.get(this.userId, true).subscribe(user => {
        this.isLoading = false;
        this.user = user;
        console.log(this.user);
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
        this.ratings.sort((a, b) => this.getTime(b.timestamp).getTime() - this.getTime(a.timestamp).getTime());
      });


      this.usersService.bids(this.userId)
        .subscribe((bids: any) => {
          this.isLoading = false;
          if (bids != null) {
            for (let i = 0; i < bids.length; i++) {
              this.bids.push(bids[i]);
            }
          }
          this.bids.sort((a, b) => this.getTime(b.timestamp).getTime() - this.getTime(a.timestamp).getTime());
        });
      this.listingsService.list()
        .subscribe((listings: any) => {
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
  changeProfilePic(files: any) {
    const file: any = files[0];
    const fr: FileReader = new FileReader();
    fr.readAsBinaryString(file);
    fr.onloadend = (e) => {

      const auxBase: any = (fr.result),
        cvt: any = btoa(auxBase);

      const aux: any = {
        filename: file['name'],
        encoding: 'base64',
        contentType: file['type'],
        content: cvt
      };
      this.user.image = cvt;
      this.submit(aux);
    };
  }
  async submit(data: any) {
    this.isLoading = true;
    const idToken = await this.authenticationService.authService.setToken();
    localStorage.setItem('_token', idToken);
    this.usersService.uploadPhoto(this.userId, data).subscribe((res:any) => {
      if(res != undefined && res.name != 'not allowed'){
        this.evtService.broadcast('avatar-changed', data);
      }
      else 
        alert(res.message);

       this.isLoading = false;
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

  openModalcontact(content: any, config?: object): boolean {
    this.modalService.open(content, { windowClass: 'modalRequestContact' });
    return false;
  }
  sendMessage(modal: any) {
    if (this.user !== undefined) {
      // let message:any = {
      //   from: {
      //     id: this.user.id,
      //     message: this.frmContactData.message,
      //     timestamp: new Date()
      //   },
      //   to: {
      //     email: this.detail.user.email,
      //     id: this.detail.user.id,
      //     image: this.detail.user.image,
      //     name: this.detail.user.name
      //   }
      // };
      this.usersService.sendMessage(this.userId, { message: this.frmContactData.message }).subscribe((user: any) => {
        this.modalService.dismissAll();
        this.modalService.open(modal);
      });
    }
  }

  toggleFollowing(id: string, i: number) {
    this.ngZone.run(() => {

      this.user = this.authenticationService.user;
      this.listingsService
        .unfollow(id, this.user)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe((res: any) => {
          this.getFollowing();
        });
    });
  }
  getTime(timestamp: any): Date {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  }
  openCar(id: string) {
    this.router.navigate(['/bid-detail/' + id], { replaceUrl: true });
  }
  makeTrustedImage(listing: any, item: any) {
    let url:string = "";

    if(item != undefined)
      url = typeof item === 'string' ? item : item.content;

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
