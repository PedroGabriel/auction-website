import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styles: [ `
  select {

    background: none;
    height: 50px;
    background-color: #f05b7a;
    color: white;
    border: 0px;
    
  }
  `]
})
export class UserSettingsComponent implements OnInit {
  editing: boolean;

  userId: string;
  currentUser: any;
  user: any;
  isLoading: boolean;

  formData: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService
  ) {
    this.formData = this.formBuilder.group(
      {
        commentsOrder: ['', Validators.required],
        bidSound: ['', Validators.required],
        commentSound: ['', Validators.required],
        enableEmailMention: ['', Validators.required],
        enableEmailWatched: ['', Validators.required],
        enableEmailListings: ['', Validators.required],
        enableTextNotifications: ['', Validators.required],
        enableSms : ['', Validators.required],
      }
      // { validator: this.matchingPasswords('password', 'password_confirm') }
    );
  }

  ngOnInit() {
    this.isLoading = false;

    this.currentUser = this.authenticationService.user;
    this.userId = this.currentUser['id'];

    if (this.userId) {
      this.isLoading = true;
      this.usersService.get(this.userId, true).subscribe(user => {
        this.isLoading = false;
        this.user = user;
        if(this.user.settings == undefined) {
          this.user.settings = {
            commentsOrder: 'newest',
            bidSound: 1,
            commentSound: 1,
            enableEmailMention: 1,
            enableEmailWatched: 1,
            enableEmailListings:1,
            enableTextNotifications: 1,
            enableSms:1
          }
        }
        Object.keys(this.formData.controls).forEach(name => {
          if(user[name])
            this.formData.controls[name].setValue(user[name])
        });

      });
    }

  }

  async submit() {
    this.isLoading = true;
    let data = this.user;
    const token = await this.authenticationService.authService.setToken();
    localStorage.setItem('_token', token);
    this.usersService.edit(this.userId, data).subscribe((res) => {
      this.isLoading = false;
      this.editing = false;
    });
  }

  private formFinalize(clear?: boolean) {
    this.formData.markAsPristine();
    if (clear) {
      this.formData.reset();
    }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }
}
