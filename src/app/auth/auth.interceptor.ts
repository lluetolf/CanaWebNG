import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoggingService} from "../logging/logging.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private logger: LoggingService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.logger.info(
      "Intercept and add Bearer token. [" + this.authService.accessToken.substring(0, 16) + "]")
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.accessToken}`
      }
    });
    return next.handle(request);
  }
}
