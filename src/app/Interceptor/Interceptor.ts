import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators";
import { Router } from "@angular/router";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class MyInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 401:
        // return of(event);
        break;
      default:
    }
    return throwError(event);
  }
}