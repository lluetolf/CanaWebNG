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
    super(http, logger, `${environment.apiBaseUri}/payables`)
  }

  refreshPayables(reset: boolean = false) {
    return this.refreshData(reset)
  }

}
