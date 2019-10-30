import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'pages';

@Injectable()
export class PagesService {
  constructor(private httpClient: HttpClient) {
    let service = this;
  } 

  get(id: string, forceUpdate?: boolean): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get page ' + id))
      );
  }

  create(data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create page'))
    );
  }

  edit(id: string, data: any): Observable<object> {
    if (data && data.user) delete data.user;
    return this.httpClient.put('/' + collection + '/' + id + '/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not edit page ' + id))
    );
  }
}