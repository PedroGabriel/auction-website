import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../core/authentication/authentication.service';
import { PagesService } from '@app/shared/api';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
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
  .btnNewFaq {
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
    background:#ff7b00

  }
  .btnRemove {
        background: #f05b7a;
    border: none;
    color: #fff;

  }
  .form-control {
    margin: 20px 0;
  }
  `]
})
export class FaqComponent implements OnInit {
  allowEdit = false;
  editPage = false;
  isLoading = true;
  pageId = 'faqPage';
  page: any = {
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore',
    faqs: [
      {
        isCollapsed: false,
        title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore?',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec
              hendrerit enim hendrerit. Sed nec diam turpis. Duis aute irure dolor in reprehenderit in voluptate Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec hendrerit.
            `
      },
      {
        isCollapsed: false,
        title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore?',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec
              hendrerit enim hendrerit. Sed nec diam turpis. Duis aute irure dolor in reprehenderit in voluptate Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec hendrerit.
            `
      },
      {
        isCollapsed: false,
        title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore?',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec
              hendrerit enim hendrerit. Sed nec diam turpis. Duis aute irure dolor in reprehenderit in voluptate Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec hendrerit.
            `
      },
      {
        isCollapsed: false,
        title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore?',
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec
              hendrerit enim hendrerit. Sed nec diam turpis. Duis aute irure dolor in reprehenderit in voluptate Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus mi id ante ultrices, nec hendrerit.
            `
      }
    ]
  };

  constructor(private authService: AuthenticationService,
    private pagesService: PagesService) { }

  editPageData() {
    if (this.authService.isAuthenticated()) {
      this.authService.isAuthenticatedAdmin()
        .then((isAuthenticatedAdmin: boolean) => {
          this.pagesService.edit(this.pageId, this.page).subscribe((res: any) => {
            this.editPage = !this.editPage;
          });
        });
    }
  }
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.isAuthenticatedAdmin()
        .then((isAuthAdmin: boolean) => {
          if (isAuthAdmin) {
            this.allowEdit = true;
          }
        });
    }

    this.getPageData();
  }
  getPageData() {
    this.pagesService.get(this.pageId).subscribe((res: any) => {
      this.page = res;

      this.isLoading = false;
    });
  }
  removeFaq(i: number) {
    this.page.faqs.splice(i, 1);
  }
  addFaq() {
    this.page.faqs.unshift({
      title: 'New Faq',
      text: 'Content'
    });
  }
}
