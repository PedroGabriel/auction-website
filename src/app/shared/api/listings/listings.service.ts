import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const collection = 'listings';

export const listingStates: string[] = [
  'pending',
  'pre-approved',
  'approved',
  'live',
  'closed',
  'pre-approval rejected',
  'approval rejected'
];
export enum listingState {
  pending,
  pre_approved,
  approved,
  live,
  closed,
  pre_approval_rejected,
  approval_rejected
}

export const listingRegisterStepsLabel: string[] = [
  'Basic information',
  'Basic photo',
  'Waiting approval',
  'Records',
  'Additional information',
  'Gallery',
  'Card information',
  'Review submit',
  'Waiting last approval',
  'Complete'
];
export const listingRegisterStep: string[] = [
  'basic-information',
  'basic-photo',
  'waiting-approval',
  'records',
  'additional-information',
  'gallery',
  'card-information',
  'review-submit',
  'waiting-approval-final',
  'complete'
];

@Injectable()
export class ListingsService {
  constructor(private httpClient: HttpClient) {
  }

  checkState(currentState: string, allowedStates: string[]): boolean {
    return allowedStates.indexOf(currentState) > -1;
  }

  checkRegisterStep(currentState: string, allowedState: string): boolean {
    const current: number = listingRegisterStep.indexOf(currentState);
    const shouldBe: number = listingRegisterStep.indexOf(allowedState);
    return current === shouldBe;
  }

  checkRegisterStepNumber(curretnStep: string): number {
    return listingRegisterStep.indexOf(curretnStep);
  }

  checkAllowedRegisterStep(currentState: string, allowedState: string): boolean {
    const current: number = listingRegisterStep.indexOf(currentState);
    const shouldBe: number = listingRegisterStep.indexOf(allowedState);
    return current <= shouldBe;
  }

  list(forceUpdate?: boolean): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get listings list'))
      );
  }

  get(id: string, forceUpdate?: boolean): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/' + id + '/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get listing ' + id))
      );
  }

  create(data: any): Observable<object> {
    if (data) {
      if (data.user) {
        delete data.user;
      }
      if (data.auctionStart) {
        delete data.auctionStart;
      }
    }

    return this.httpClient.post('/' + collection + '/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create listing'))
    );
  }

  edit(id: string, data: any): Observable<object> {
    if (data) {
      if (data.user) {
        delete data.user;
      }
      if (data.auctionStart) {
        delete data.auctionStart;
      }
    }
    return this.httpClient.put('/' + collection + '/' + id + '/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not edit listing ' + id))
    );
  }

  delete(id: string): Observable<object> {
    return this.httpClient.delete(`/${collection}/${id}`);
  }

  uploadPhotos(listing: string, folder: string, data: any): Observable<object> {
    const documents: any = {
      folder: folder,
      photos: data
    };
    return this.httpClient.put('/' + collection + '/' + listing + '/photos/', documents).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not upload listing ' + listing + ' photos'))
    );
  }

  deletePhoto(listing: string, photo: any, folder: string): Observable<object> {
    const documents: any = {
      folder: folder,
      photos: photo
    };
    return this.httpClient.request('delete', '/' + collection + '/' + listing + '/photos/', { body: documents }).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not delete listing ' + listing + ' photos'))
    );
  }

  uploadRecords(listing: string, data: any): Observable<object> {
    if (data) {
      if (data.user) {
        delete data.user;
      }
      if (data.auctionStart) {
        delete data.auctionStart;
      }
    }

    return this.httpClient.put('/' + collection + '/' + listing + '/records/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not upload listing ' + listing + ' records'))
    );
  }

  uploadFiles(listing: string, data: any): Observable<object> {
    const documents: any = {
      folder: 'documents',
      documents: data
    };
    return this.httpClient.put('/' + collection + '/' + listing + '/files/', documents).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not upload listing ' + listing + ' files'))
    );
  }

  listByState(state: string, forceUpdate?: boolean): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/state/' + state, {})
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get listing list by state ' + state))
      );
  }

  listByStateOrderBy(state: string, forceUpdate?: boolean, order?: string): Observable<object> {
    return this.httpClient
      .cache(forceUpdate)
      .get('/' + collection + '/state/' + state + '?orderByChild=' + order, {})
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get listing list by state ' + state))
      );
  }

  search(params: object, forceUpdate?: boolean): Observable<object> {
    const query_array: any = [];
    let query_string = '';
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        if (typeof params[p] === typeof [] && params[p].length) {
          for (const v in params[p]) {
            if (v) {
              query_array.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p][v]));
            }
          }
        } else {
          query_array.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
        }
      }
    }
    query_string = query_array.join('&');

    return this.httpClient
      .get('/' + collection + '/?' + query_string)
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get search listings by ' + query_string))
      );
  }

  getComments(listing: string): Observable<object> {
    return this.httpClient
      .cache()
      .get('/' + collection + '/' + listing + '/comments/')
      .pipe(
        map((body: any) => body),
        catchError(() => of('Error, could not get listing ' + listing + ' comments'))
      );
  }

  createComment(listing: string, data: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/' + listing + '/comments/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create listing ' + listing + ' comment'))
    );
  }

  likeComment(listing: string, comment: string): Observable<object> {
    return this.httpClient.get('/' + collection + '/' + listing + '/comments/' + comment + '/like').pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create listing ' + listing + ' comment'))
    );
  }

  unlikeComment(listing: string, comment: string): Observable<object> {
    return this.httpClient.get('/' + collection + '/' + listing + '/comments/' + comment + '/unlike').pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not create listing ' + listing + ' comment'))
    );
  }


  approve(listing: string, comment?: string): Observable<object> {
    const data = {};
    if (comment && typeof comment !== undefined) {
      data['comment'] = comment;
    }
    this.edit(listing, { registerStep: 'complete' }).subscribe();
    return this.httpClient.post('/' + collection + '/' + listing + '/approve/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not change listing ' + listing + ' state to approve'))
    );
  }

  rejectApproval(listing: string, comment?: string): Observable<object> {
    const data = {};
    if (comment && typeof comment !== undefined) {
      data['comment'] = comment;
    }
    return this.httpClient.post('/' + collection + '/' + listing + '/reject-approval/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not change listing ' + listing + ' state to reject-approval'))
    );
  }

  preApprove(listing: string, comment?: string): Observable<object> {
    const data = {};
    if (comment && typeof comment !== undefined) {
      data['comment'] = comment;
    }

    this.edit(listing, { registerStep: 'additional-information' }).subscribe();
    return this.httpClient.post('/' + collection + '/' + listing + '/pre-approve/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not change listing ' + listing + ' state to pre-approve'))
    );
  }

  rejectPreApproval(listing: string, comment?: string): Observable<object> {
    const data = {};
    if (comment && typeof comment !== undefined) {
      data['comment'] = comment;
    }
    return this.httpClient.post('/' + collection + '/' + listing + '/reject-pre-approval/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not change listing ' + listing + ' state to reject-pre-approval'))
    );
  }

  follow(id: any, user: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/' + id + '/follow/', { user: user }).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }
  unfollow(id: any, user: any): Observable<object> {
    return this.httpClient.post('/' + collection + '/' + id + '/unfollow/', { user: user }).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body['error'] ? body['error'] : false))
    );
  }
  goLive(listing: string, comment?: string, price?: number): Observable<object> {
    const data = {};
    if (comment && typeof comment !== undefined) {
      data['comment'] = comment;
    }
    this.edit(listing, { price: price ? price : 0 }).subscribe();
    return this.httpClient.post('/' + collection + '/' + listing + '/go-live/', data).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not change listing ' + listing + ' state to go-live'))
    );
  }
  deleteComment(comment: string, listing: string): Observable<object> {
    return this.httpClient.request('delete', '/' + collection + '/' + listing + '/comments/' + comment, {}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not delete the comment '))
    );
  }
  uploadCover(listing: string, file: any) {
    return this.httpClient.put(`/listings/${listing}/cover/`, file).pipe(
      map(body => body),
      catchError(() => of('Error uploading cover'))
    );
  }
}
