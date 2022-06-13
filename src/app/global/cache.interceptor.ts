import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import * as dayjs from "dayjs";
import {LoggingService} from "../logging/logging.service";
import {tap} from "rxjs/operators";

type CachedResponse = {
  expires: Date,
  response: HttpResponse<unknown>
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  readonly CACHE_DURATION_IN_MINUTES = 5;
  private cache: Map<string, CachedResponse> = new Map()

  constructor(private logger: LoggingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Pass all none GET request down the chain
    if(request.method !== "GET") {
      return next.handle(request)
    }

    // Check for forced reset
    if(request.headers.get("reset")) {
      this.cache.delete(request.url)
    }

    // Verify cache
    const cachedResponse = this.cache.get(request.url)
    if(cachedResponse) {
      if (dayjs(new Date()).isBefore(cachedResponse.expires)) {
        this.logger.info("Using cached response.")
        return of(cachedResponse.response.clone())
      } else {
        this.logger.info("Cache expired. Removing value.")
        this.cache.delete(request.url)
      }
    }

    // Create a new entry
    this.logger.info("Making request to server to get data.")
    const expires = dayjs(new Date())
      .add(this.CACHE_DURATION_IN_MINUTES, 'minutes')
      .toDate();
    return next.handle(request).pipe(
      tap( stateEvent=> {
        if(stateEvent instanceof HttpResponse) {
          this.cache.set(request.url, { expires: expires, response: stateEvent.clone() } )
        }
      })
    )
  }
}
