import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'cars';

@Injectable()
export class CarsService {
  user: any;

  constructor(private httpClient: HttpClient) { }

  get(): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/')
      .pipe(
        map((body: any) => body),
        catchError((body: any) => of(body['error'] ? body['error'] : false))
      );
  }

  addModel(brand: string, model: string) {
    return this.httpClient.post(`/${collection}/${brand}/${model}`, {});
  }

}
