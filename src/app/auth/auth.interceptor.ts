import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, from} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoggingService} from "../logging/logging.service";
import {mergeMap} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private logger: LoggingService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.loggedInUser.getIdToken()).pipe(
      mergeMap(
        (token) => {
          this.logger.info("Intercept and add Bearer token. [" + token.substring(0, 16) + "]")
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(request);
        }
      )
    )
  }
}
