import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable, of} from 'rxjs';
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
    if(request.headers.get("reset") &&  request.headers.get("reset") === "true") {
      this.logger.info("Rest cache for: " + request.url)
      this.cache.delete(request.url)
    }

    // Verify cache
    const cachedResponse = this.cache.get(request.url)
    if(cachedResponse) {
      if ((new Date()).getTime() < cachedResponse.expires.getTime()) {
        this.logger.info("Using cached response.")
        return of(cachedResponse.response.clone())
      } else {
        this.logger.info("Cache expired. Removing value.")
        this.cache.delete(request.url)
      }
    }

    // Create a new entry
    this.logger.info("Making request to server to get data.")
    const tmp = new Date()
    const expires = new Date(tmp.getTime() + this.CACHE_DURATION_IN_MINUTES * 60000)

    return next.handle(request).pipe(
      tap( stateEvent=> {
        if(stateEvent instanceof HttpResponse) {
          this.cache.set(request.url, { expires: expires, response: stateEvent.clone() } )
        }
      })
    )
  }
}
