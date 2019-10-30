import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Logger, I18nService, AuthenticationService } from '@app/core';

import { UsersService } from '@app/shared/api';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
    styles: [ `
  .admin-avatar {

      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0;

      object-fit: cover;
      object-position: center right;
  }
  `
  ]
})
export class AdminUsersComponent implements OnInit {
  isLoadingUsers: boolean;
  users: Array<any>;

  errorRegister: string;
  registerForm: FormGroup;
  isLoadingRegister = false;

  @ViewChild('modalSignUpSuccess') private modalSignUpSuccess: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private usersService: UsersService,
    private domSanitizer: DomSanitizer
  ) {
    this.createRegisterForm();
  }

  ngOnInit() {
    this.isLoadingUsers = true;
    this.users = [];

    this.usersService.list().subscribe((users: any[]) => {
       this.users = users;
       this.users.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
      });
    });
  }

  register() {
    this.isLoadingRegister = true;
    let newUser = this.registerForm.value;
    this.authenticationService.register(newUser, true).then(
      credentials => {
        newUser['uid'] = credentials['uid'];
        console.log('newUser',newUser);
        this.registerFinalize(true);
        this.closeModal();
        const that = this;
        setTimeout(function(){
          that.users.push(newUser);
          that.openModal(that.modalSignUpSuccess)
        });
      },
      error => {
        this.registerFinalize();
        this.errorRegister = error;
      }
    );
  }

  openModal(content: any, config?: object): boolean {
    this.modalService.open(content, config);
    return false;
  }

  closeModal() {
    this.modalService.dismissAll();
    return true;
  }

  private createRegisterForm() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        password: ['', Validators.required],
        password_confirm: ['', Validators.required]
      },
      { validator: this.matchingPasswords('password', 'password_confirm') }
    );
  }

  private registerFinalize(clear?: boolean) {
    this.registerForm.markAsPristine();
    this.isLoadingRegister = false;
    if (clear) {
      this.registerForm.reset();
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
  getImage(img:any) {
    let auxBase:string = "data:image/jpg;base64,";
    if(img.search("http") == -1)
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase+img);
    else
      return img;
  }
}
