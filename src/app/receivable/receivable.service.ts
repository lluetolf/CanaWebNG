import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../global/base-service';
import { LoggingService } from '../logging/logging.service';
import { Receivable } from './receivable.model';

@Injectable({
  providedIn: 'root'
})
export class ReceivableService extends BaseService<Receivable> {

  constructor(http: HttpClient,
    logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/receivable`)
  }

  getReceivables(harvest: string): Observable<Receivable[]> {
    return this.http.get<Receivable[]>(this.url + "/all");
  }
}
