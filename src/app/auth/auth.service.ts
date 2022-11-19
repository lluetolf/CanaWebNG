import {Injectable} from '@angular/core';

import {LoggingService} from "../logging/logging.service";
import {Auth, User, signInWithEmailAndPassword, signOut, authState} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LS_USER_KEY = 'app-currentUser'
  loggingIn$ = new Subject<boolean>();
  loggedInUser: User|undefined;
  private _accessToken: string = "";

  constructor(
    private logger: LoggingService,
    public auth: Auth,
    public router: Router
  ) {
    this.loggingIn$.next(false);
    authState(this.auth).subscribe((user) => {
      if(user) {
        localStorage.setItem(this.LS_USER_KEY, JSON.stringify(user));
        this.router.navigate(['']);
      } else {
        localStorage.setItem(this.LS_USER_KEY, "");
      }
    })
  }

  get isLoggedIn(): boolean {
    return this.auth.currentUser != null;
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }


  async login(email: string, password: string) {
    this.logger.info("Authenticating: " + email)

    signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.loggedInUser = result.user
        this.loggedInUser.getIdToken().then(x => {
          this._accessToken = x;
        })
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }

  logout() {
    signOut(this.auth).then(
      () => {
        console.log("Logged out.");
        this.router.navigate(['auth']);
      },
      () => { console.log("Error logging out.")}
    )
  }

  get accessToken(): string {
    return this._accessToken
  }
}
