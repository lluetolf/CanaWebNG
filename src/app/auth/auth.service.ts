import {Injectable, NgZone} from '@angular/core';

import {LoggingService} from "../logging/logging.service";
import {Auth, User, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser: User|undefined;
  private _accessToken: string = "";

  constructor(
    private logger: LoggingService,
    public auth: Auth,
    public router: Router
  ) {  }

  get isLoggedIn(): boolean {
    return this.auth.currentUser != null;
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }


  login(email: string, password: string) {
    this.logger.info("Authenticating: " + email)
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.loggedInUser = result.user
        this.loggedInUser.getIdToken().then(x => this._accessToken = x)
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }



  logout() {
    signOut(this.auth).then(
      () => { console.log("Logged out.")},
      () => { console.log("Error logging out.")}
    )
  }

  get accessToken(): string {
    return this._accessToken
  }
}
