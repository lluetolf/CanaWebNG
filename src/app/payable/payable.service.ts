import { Injectable } from '@angular/core';
import {Field} from "../field/field.model";
import {BehaviorSubject, Observable} from "rxjs";
import {Payable} from "./payable.model";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../logging/logging.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PayableService {
  private payables!: Payable[];
  payables$ = new BehaviorSubject<Payable[]>([]);
  fetchedPayableTS!: Date;
  constructor(private http: HttpClient, private logger: LoggingService) {
    this.getAllPayables()
  }

  getAllPayables(): Observable<Payable[]> {
    const url = `${environment.apiBaseUri}/payables`
    const ts = new Date()
    this.logger.info("Call GET: " + url + " @ " + ts)
    this.fetchedPayableTS = ts

    this.http.get<Payable[]>(url).subscribe( list => {
      this.payables = list;
      this.payables$.next(this.payables);
    });

    return this.payables$.asObservable()
  }
}
