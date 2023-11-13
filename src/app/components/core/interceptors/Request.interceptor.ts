import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
        req = req.clone({
          setHeaders: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
          }
          // all good now response should be the same for all the r
      })
    }

    return next.handle(req);
  }
}