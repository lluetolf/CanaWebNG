import { Injectable } from '@angular/core';
import {Payable} from "./payable.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoggingService} from "../logging/logging.service";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {BaseService} from "../global/base-service";

@Injectable({
  providedIn: 'root'
})
export class PayableService extends BaseService<Payable> {

  readonly concepts = ["AGROQUIMICOS", "COMIDA", "COSECHA", "FERTILIANTES", "GASOLINA", "MANO DE OBRA"]

  constructor(http: HttpClient,
    logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/payable`)
  }

  refreshPayables(reset: boolean = false) {
    return this.refreshData(reset)
  }

  getDataForMonth(year: number, month: number) {
    let urlGetAll = this.url + `/month?year=${year}&month=${month+1}`;
    this.logger.info("Fetching date from: " + urlGetAll);

    let payables$ = this.http.get<Payable[]>(urlGetAll, { headers: new HttpHeaders({"reset": String(false) }) }).pipe(
      map(
        (data: Payable[]) => {
          return data.map(d => {
            let dateFields = Object.keys(d).filter(x => x.includes("Date"))
            dateFields.forEach( (x) => {
              console.log("Covnert: " + x);
              (d as any)[x] = this.createDateAsUTC((d as any)[x]);
            })
            return d
          });
        },
      )
    );
    this.data$ = payables$
  }

}
