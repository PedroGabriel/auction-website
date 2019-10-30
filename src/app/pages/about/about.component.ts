import { Component, OnInit } from '@angular/core';

import { PagesService } from '@app/shared/api';
import { environment } from '@env/environment';
import { AuthenticationService } from '../../core/authentication/authentication.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styles: [`
  .btnEdit{
  	    background: #f05b7a;
    border: none;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.8em;
    width: 150px;
    height: 46px;
    border-radius: 2px;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1px;
    float:right;
    margin:10px;
  }
  .btnConfirm{
  	    background: #5bf077;
    border: none;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.8em;
    width: 150px;
    height: 46px;
    border-radius: 2px;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1px;
    float:right;
    margin:10px;
  }
  .form-control {
    margin: 20px 0;
  }
  `]
})
export class AboutComponent implements OnInit {
  version: string = environment.version;
  allowEdit = false;
  editPage = false;
  isLoading = true;
  pageId = 'aboutPage';

  page: any = {
    cards: [{
      title: 'About',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et elementum turpis. Sed et mattis justo. Pellentesque congue ipsum nec tempus condimentum. Vivamus molestie diam lectus, vitae tincidunt mi condimentum vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et elementum turpis.'
    }, {
      title: 'Consectetur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et elementum turpis. Sed et mattis justo. Pellentesque congue ipsum nec tempus condimentum. Vivamus molestie diam lectus, vitae tincidunt mi condimentum vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et elementum turpis.'
    }, {
      title: 'Nullam et elementum',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et elementum turpis. Sed et mattis justo. Pellentesque congue ipsum nec tempus condimentum. Vivamus molestie diam lectus, vitae tincidunt mi condimentum vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et elementum turpis.'
    }],
    about: {
      subTitle: 'NISI UT ALIQUIP',
      title: 'Know Issues',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim!'
    },
    aboutMiddle: {
      subTitle: 'NISI UT ALIQUIP',
      title: 'Ullamco laboris nisi ut <br> aliquip ex ea',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim!'
    },
    aboutList: [{
      title: 'Lorem ipsum',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: 'assets/images/about-icon2.png'
    }, {
      title: 'Know',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: 'assets/images/about-icon1.png'
    }]
  }
  constructor(
    private authService: AuthenticationService,
    private pagesService: PagesService) {

  }
  editPageData() {
    if (this.authService.isAuthenticated()) {
      this.authService.isAuthenticatedAdmin()
        .then((isAutheticatedAdmin: boolean) => {
          if (isAutheticatedAdmin) {
            this.pagesService.edit(this.pageId, this.page).subscribe((res: any) => {
              this.editPage = !this.editPage;
            });
          }
        });

    }
  }
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.isAuthenticatedAdmin()
        .then((isAtuheticatedAdmin: boolean) => {
          if (isAtuheticatedAdmin) {
            this.allowEdit = true;
          }
        });

    }

    this.getPageData();
  }
  getPageData() {
    this.pagesService.get(this.pageId).subscribe((res: any) => {
      if (res != null && res.length > 0) {
        this.page = res;
      }

      this.isLoading = false;
    });
  }
}
