import {Injectable} from '@angular/core';

import {LoggingService} from "../logging/logging.service";
import {Auth, User, signInWithEmailAndPassword, signOut, authState, onAuthStateChanged} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LS_USER_KEY = 'app-currentUser'
  loggingIn$ = new Subject<boolean>();

  public get loggedInUser(): User {
    return this.auth.currentUser!
  }

  constructor(
    private logger: LoggingService,
    public auth: Auth,
    public router: Router
  ) {
    this.logger.info("Create AuthService")
    this.loggingIn$.next(false);
    authState(this.auth).subscribe((user) => {
      if(user) {
        localStorage.setItem(this.LS_USER_KEY, JSON.stringify(user));
        this.router.navigate(['']);
      } else {
        localStorage.setItem(this.LS_USER_KEY, "");
      }
    })
    // onAuthStateChanged(this.auth, user => {
    //   if(user) {
    //     this.logger.info("Write user to localStorage.")
    //     localStorage.setItem(this.LS_USER_KEY, JSON.stringify(user));
    //     this.router.navigate(['']);
    //   } else {
    //     localStorage.setItem(this.LS_USER_KEY, "");
    //   }
    // })
  }

  get isLoggedIn(): boolean {
    return this.auth.currentUser != null
  }


  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => { this.logger.info("Authenticated: " + email) })
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
}
