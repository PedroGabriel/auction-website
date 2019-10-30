import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private httpClient: HttpClient) { }

  reportComment(listingId: string, commentId: string, message: string, user: any): Observable<object> {

    console.log(user);
    const data = {
      message,
      user: {
        id: user['id'],
        name: user['name'],
        email: user['email']
      }
    };

    return this.httpClient.post(`/listings/${listingId}/comments/${commentId}/report`, data);
  }

  getReports() {
    return this.httpClient.get(`/reports/`);
  }

  reviewReport(reportId: string, deleteComment: boolean) {
    const data = { deleteComment };
    return this.httpClient.post(`/reports/${reportId}`, data);
  }
}
