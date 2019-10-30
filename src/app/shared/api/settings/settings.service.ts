import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'settings';

@Injectable()
export class SettingsService {
  user: any;

  constructor(private httpClient: HttpClient) {}

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
        catchError((body: any) => of(body['error']?body['error']:false))
      );
  }

  get(id: string, forceUpdate?: boolean): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error']?body['error']:false))
      );
  }
  create(data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error']?body['error']:false))
    );
  }

  edit(id: string, data: any): Observable<object> {
    return this.httpClient.put('/' + collection + '/' + id + '/', data).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error']?body['error']:false))
    );
  } 

  listings(id?: any, forceUpdate?: boolean): Observable<object> {
    if (!id || typeof id !== typeof '') id = this.currentUser;
    if (!id || typeof id !== typeof '') return empty();

    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/listings/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error']?body['error']:false))
      );
  } 
}
