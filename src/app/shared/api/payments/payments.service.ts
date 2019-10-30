import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'payments';

@Injectable()
export class PaymentsService {
  constructor(private httpClient: HttpClient) { }

  // {
  //   "userid": "ojHU90Bp1XOx8KJtQBLNa2RzTQZ2",
  //   "number": "4000000760000002",
  //   "expdate": "11/19",
  //   "cvc": "123",
  //   "token": "tok_br",
  //   "cardholdername": "Stripe Teste Payment",
  //   "street": "Olmsted Falls",
  //   "streetlinetwo": "",
  //   "city": "OH",
  //   "zip": "44138",
  //   "state": "Clevelãndia",
  //   "country": "EUA"
  // }
  creditCard(data: any): Observable<object> {
    return this.httpClient.post(`/${collection}/`, data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create credit card'))
    );
    // data['token'] = 'tok_br';
    // return this.httpClient.post('/' + collection + '/source/', data).pipe(
    //   map((body: any) => body),
    //   catchError(() => of('Error, could not create credit card'))
    // );
  }

  // TODO
  // {
  //   "userid": "ojHU90Bp1XOx8KJtQBLNa2RzTQZ2",
  //   "amount": 1,
  //     "currency": "USD",
  //     "description": "Aqui vai o que vai aparecer nos extratos do cliente",
  //     "source": "tok_visa",
  //   "capture": true
  // }
  charge(data: any): Observable<object> {
    return this.httpClient.post(`/${collection}/createHold`, data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create charge'))
    );
  }

  // TODO
  // {
  //   "userid": "ojHU90Bp1XOx8KJtQBLNa2RzTQZ2",
  //   "chargeid": "oorttChU4l0gyDAqrJdY"
  // }
  refundCharge(data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/refunds/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create refund charge'))
    );
  }

  // TODO
  // {
  //   "userid": "ojHU90Bp1XOx8KJtQBLNa2RzTQZ2",
  //   "chargeid": "oorttChU4l0gyDAqrJdY"
  // }
  efetiveCharge(data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/refunds/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create efetive refund charge'))
    );
  }
}
