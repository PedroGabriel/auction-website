import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService, PaymentsService } from '@app/shared/api';

@Component({
  styles: [
    `
    a {
      color: white;
      text-decoration: none;
    }
    `
  ],
  selector: 'app-card-information',
  templateUrl: './card-information.component.html'
})
export class NewCarCardInformationComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;

  creditCardForm: FormGroup;
  isLoading: boolean;
  submitted = false;

  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private paymentsService: PaymentsService,
    private listingsService: ListingsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.creditCardForm = this.formBuilder.group({
      // number: ['', Validators.required],
      // expdate: ['', Validators.required],
      // cvc: ['', Validators.required],
      cardholdername: ['', Validators.required],
      street: ['', Validators.required],
      streetlinetwo: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.listing = params['listing'];
    });

    this.user = this.authenticationService.user;

    const style = {
      base: {
        fontSize: '16px',
        color: '#495057',
        fontFamily: '"Open Sans", sans-serif'
      },
    };

    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount('#card-number');

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount('#card-cvc');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.creditCardForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.creditCardForm.invalid) {
      return;
    } else {
      this.submitted = true;
      this.submit();
    }
  }

  async submit() {
    const data = this.creditCardForm.value;
    this.isLoading = true;
    const ownerInfo = {
      owner: {
        name: data.cardholdername,
        address: {
          line1: data.street,
          line2: data.streetlinetwo,
          city: data.city,
          postal_code: data.zip,
          country: data.country,
        },
        email: this.user['email']
      },
    };

    const { source, error } = await stripe.createSource(this.cardNumber, ownerInfo);
    if (error) {
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      const payment = {
        email: this.user['email'],
        userId: this.user['id'],
        sourceId: source.id
      };
      this.paymentsService.creditCard(payment)
        .subscribe((response: object) => {
          this.listingsService.edit(this.listing, { registerStep: 'waiting-approval-final' }).subscribe(() => {
            this.isLoading = false;
            this.finalizeForm(true);
            this.router.navigate(['/new-car/waiting-approval-final/' + this.listing], { replaceUrl: true });
          });
        });
    }
    // temporariamente
    // this.listingsService.edit(this.listing, { registerStep: 'review-submit' }).subscribe(() => {
    //   this.isLoading = false;
    //   this.router.navigate(['/new-car/review-submit/' + this.listing], { replaceUrl: true });
    // });
    // return true;

    // this.paymentsService
    //   .creditCard(data)
    //   .subscribe((response: object) => {
    //     if (response && response['id']) {
    //       this.listingsService.edit(this.listing, { registerStep: 'review-submit' }).subscribe(() => {
    //         this.isLoading = false;
    //         this.finalizeForm(true);
    //         this.router.navigate(['/new-car/review-submit/' + this.listing], { replaceUrl: true });
    //       });
    //     }
    //   });
  }

  private finalizeForm(clear?: boolean) {
    this.creditCardForm.markAsPristine();
    if (clear) {
      this.creditCardForm.reset();
    }
  }
}
