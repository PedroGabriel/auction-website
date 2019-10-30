import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const token = sessionStorage.getItem('_token') || localStorage.getItem('_token');
        const authReq = token ?
            request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'idToken': token
                })
            })
            : request;

        return next.handle(authReq);
    }
}
