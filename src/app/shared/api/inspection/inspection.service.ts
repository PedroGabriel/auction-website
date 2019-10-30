import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  collection = 'inspections';

  constructor(private httpClient: HttpClient) { }

  requestInspection(listingId: string) {
    return this.httpClient.post(`/${this.collection}/`, { listingId });
  }

  reviewInspection(listingId: string, approve: boolean) {
    return this.httpClient.post(`/${this.collection}/approveorreject/`, { listingId, approve });
  }

  sendInspection(listing: string, data: any): Observable<any> {
    return this.httpClient.put<any>(`/listings/${listing}/inspection`, data);
  }
}
