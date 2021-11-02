import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { environment } from '../../environments/environment';
import {shareReplay, tap} from "rxjs/operators";
import * as moment from "moment";
import {IAuthResponse} from "./IAuthResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }


  login(username: string, password: string) {
    let payload = { email: username, password: password }
    let url = `${environment.apiBaseUri}/login`
    console.log("URL: " + url)
    return this.http.post<IAuthResponse>(url, payload)
      .pipe(
        tap(res => this.setSession(res)),
        shareReplay()
      )
  }

  private setSession(authResult: IAuthResponse) {
    let token = authResult.bearer_token != null ? authResult.bearer_token : authResult.accessToken;
    if (token != undefined) {
      let expiresAt = null;
      if(authResult.expires_at == undefined) {
        expiresAt = moment().add(60*60,'second');
      } else {
        expiresAt = moment().add(authResult.expires_at,'second');
      }

      localStorage.setItem('bearer_token', token);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }
  }

  logout() {
    this.http.post<any>(`${environment.apiBaseUri}/logout`, {});
    // remove user from local storage to log user out
    localStorage.removeItem('bearer_token');
    localStorage.removeItem('expires_at');
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if( expiration != null) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return 0;
    }
  }

  getToken(): string {
    const token = localStorage.getItem("bearer_token");
    return token == null ? "NO_TOKEN" : token;
  }
}
