import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService, PaymentsService } from '@app/shared/api';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-payment',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.scss']
})
export class UserPaymentComponent implements OnInit {
  editing: boolean;

  userId: string;
  currentUser: any;
  isLoading: boolean;

  formData: FormGroup;

  paymentInfo: any;

  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private paymentService: PaymentsService
  ) {
    this.formData = this.formBuilder.group(
      {
        email: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        about: []
      }
      // { validator: this.matchingPasswords('password', 'password_confirm') }
    );
  }

  setupCardInputs() {
    const style = {
      base: {
        fontSize: '16px',
        color: '#495057',
        fontFamily: '"Open Sans", sans-serif',
        lineHeight: '1.5',
        textAlign: 'middle'
      },
    };

    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount('#card-number');

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount('#card-cvc');
  }

  ngOnInit() {
    this.isLoading = false;

    this.currentUser = this.authService.user;
    this.userId = this.currentUser['id'];
    this.getUser();
  }

  getUser() {
    if (this.userId) {
      this.isLoading = true;
      this.usersService.paymentInfo(this.userId)
        .subscribe(paymentInfo => {
          this.isLoading = false;
          this.paymentInfo = paymentInfo;
        });
    }
  }

  openConfirm(content: any) {
    this.modalService.open(content);
  }

  openAdd(content: any) {
    this.modalService.open(content);
    this.setupCardInputs();
  }

  deletePayment() {
    this.isLoading = true;
    this.authService.authService
      .setToken()
      .then(idToken => {
        console.log(idToken);
        this.usersService.unregisterPayment(idToken)
          .subscribe(response => {
            this.isLoading = false;
            if (response) {
              this.modalService.dismissAll();
              this.getUser();
            }
          });
      }).catch(error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  async changePayment() {
    this.isLoading = true;

    const ownerInfo = {
      owner: {
        name: this.currentUser['name'],
        email: this.currentUser['email']
      },
    };

    const { source, error } = await stripe.createSource(this.cardNumber, ownerInfo);
    if (error) {
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      const payment = {
        email: this.currentUser['email'],
        userId: this.currentUser['id'],
        sourceId: source.id
      };
      this.paymentService.creditCard(payment)
        .subscribe((response: object) => {
          this.isLoading = false;
          this.modalService.dismissAll();
          this.getUser();
        });
    }
  }
}
