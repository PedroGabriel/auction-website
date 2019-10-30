import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ListingsService, UsersService } from '@app/shared/api';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class AdminUserEditComponent implements OnInit {
  editing: boolean;

  userId: string;
  user: any;
  isLoading: boolean;
  errorMessage:string;
  formData: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private afAuth: AngularFireAuth,
    private listingsService: ListingsService,
    private usersService: UsersService
  ) {
    this.formData = this.formBuilder.group(
      {
        email: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        about: [],
        password: [],
        password_confirm: []
      },
      { validator: this.matchingPasswords('password', 'password_confirm') }
    );
  }

  ngOnInit() {
    this.isLoading = false;

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
    });

    if (this.userId) {
      this.isLoading = true;
      this.usersService.get(this.userId, true).subscribe(user => {
        this.isLoading = false;
        this.user = user;
        Object.keys(this.formData.controls).forEach(name => {
          if(user[name])
            this.formData.controls[name].setValue(user[name])
        });

      });
    }

  }

  submit() {
    this.isLoading = true;
    const data = {
      email: this.formData.value.email,
      name: this.formData.value.name,
      phone: this.formData.value.phone,
      about: this.formData.value.about
    };

    if (this.formData.value.password != null && this.formData.value.password !== '' &&
      (this.formData.value.password === this.formData.value.password_confirm)) {
      this.changePassword(this.formData.value.password, data);
    } else {
      this.finish(data);
    }
  }
 async finish(data: any) {
      const token = await this.authenticationService.authService.setToken();
      localStorage.setItem('_token', token);
    this.usersService.edit(this.userId, data).subscribe((res) => {
      this.isLoading = false;
      this.editing = false;
    });
  }
 
 async changePassword(password: any, data: any) { 
    const user = this.afAuth.auth.currentUser;
    const userId = this.userId;
    const userData = data;
    const usersService = this.usersService;

      const token = await this.authenticationService.authService.setToken();
      localStorage.setItem('_token', token);

    user.updatePassword(password).then(() => {
      usersService.edit(userId, userData)
        .subscribe((res) => {
          // window.location.reload();
          this.editing = false;
          this.isLoading = false;
        });
    }).catch((error) => {
      this.editing = true;
      this.isLoading = false;
      this.errorMessage = error.message; 
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
