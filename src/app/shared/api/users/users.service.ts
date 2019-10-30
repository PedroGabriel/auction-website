import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'users';

@Injectable()
export class UsersService {
  user: any;

  constructor(private httpClient: HttpClient) { }

  get currentUser(): object | null {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.id ? user.id : null;
  }

  list(): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }

  get(id: string, forceUpdate?: boolean): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }
  create(data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }

  disable(id: string, disable: boolean): Observable<object> {
    return this.httpClient.put('/' + collection + '/changestatus/' + id + '/', { disabled: disable }).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }
  edit(id: string, data: any): Observable<object> {
    return this.httpClient.put('/' + collection + '/' + id + '/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }

  uploadPhoto(id: string, data: any): Observable<object> {
    return this.httpClient.put('/' + collection + '/' + id + '/profilepicture/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }


  sendMessage(id: string, data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/' + id + '/messages/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }

  sendReview(data: any): Observable<object> {
    return this.httpClient.post('/ratings/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }

  uploadPhotos(user: string, data: any): Observable<object> {
    return this.httpClient.put('/' + collection + '/' + user + '/photos/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }

  listings(id?: any, forceUpdate?: boolean): Observable<object> {
    if (!id || typeof id !== typeof '') {
      id = this.currentUser;
    }
    if (!id || typeof id !== typeof '') {
      return empty();
    }

    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/listings/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }


  getFollowing(id?: any, forceUpdate?: boolean): Observable<object> {
    if (!id || typeof id !== typeof '') {
      id = this.currentUser;
    }
    if (!id || typeof id !== typeof '') {
      return empty();
    }

    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/following/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }

  comments(id?: any): Observable<object> {
    if (!id || typeof id !== typeof '') {
      id = this.currentUser;
    }

    if (!id || typeof id !== typeof '') {
      return empty();
    }

    return this.httpClient
      .cache()
      .get('/' + collection + '/' + id + '/comments/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }
  ratings(id?: any): Observable<object> {
    if (!id || typeof id !== typeof '') {
      id = this.currentUser;
    }
    if (!id || typeof id !== typeof '') {
      return empty();
    }

    return this.httpClient
      .cache()
      .get('/' + collection + '/' + id + '/ratings/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }

  bids(id?: any): Observable<object> {
    if (!id || typeof id !== typeof '') {
      id = this.currentUser;
    }
    if (!id || typeof id !== typeof '') {
      return empty();
    }

    return this.httpClient
      .cache()
      .get('/' + collection + '/' + id + '/bids/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }

  notifications(id?: any): Observable<object> {
    if (!id || typeof id !== typeof '') {
      id = this.currentUser;
    }
    if (!id || typeof id !== typeof '') {
      return empty();
    }

    return this.httpClient
      .cache()
      .get('/' + collection + '/' + id + '/notifications/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }

  paymentInfo(id: string): Observable<object> {
    return this.httpClient.get(`/${collection}/${id}/payments/info`).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }

  unregisterPayment(idToken: string) {
    return this.httpClient.delete(`/payments/`, { headers: { 'idToken': idToken } });
  }

}
