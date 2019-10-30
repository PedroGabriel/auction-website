import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { PaymentsService, UsersService } from '@app/shared/api';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  @ViewChild('modalCreditCard')
  creditCardModal: ElementRef;
  @Output() savedCard: EventEmitter<any> = new EventEmitter();
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;

  isLoading = false;
  owner = {
    name: ''
  };

  constructor(
    private modalService: NgbModal,
    private paymentService: PaymentsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
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

  openModal() {
    this.modalService.open(this.creditCardModal, { size: 'lg' });
    this.setupCardInputs();
  }

  async registerCard() {
    this.isLoading = true;

    const ownerInfo = {
      owner: {
        name: this.owner.name
      },
    };

    const { source, error } = await stripe.createSource(this.cardNumber, ownerInfo);
    if (error) {
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      const payment = {
        email: this.owner.name,
        userId: this.authService.user['id'],
        sourceId: source.id
      };
      this.paymentService.creditCard(payment)
        .subscribe((response: object) => {
          this.isLoading = false;
          this.modalService.dismissAll();
          this.savedCard.emit();
        });
    }
  }
}
