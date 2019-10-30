import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'bids';

@Injectable()
export class BidsService {
  constructor(private httpClient: HttpClient) {}

  list(): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get bids list'))
      );
  }

  get(id: string): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/detail/' + id + '/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get bid ' + id))
      );
  }

  create(listing: string, data: any): Observable<object> {
    data['listingId'] = listing;

    return this.httpClient.post('/' + collection + '/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create bid in listing ' + listing))
    );
  }

  byListing(listing: string): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/' + listing + '/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get bids by listing ' + listing))
      );
  }
  byListingOrderBy(listing: string, order:any): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/' + listing + '/'+ "?orderByChild="+order)
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get bids by listing ' + listing))
      );
  }
}
