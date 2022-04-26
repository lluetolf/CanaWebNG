import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";

import { environment } from '../../environments/environment';
import {shareReplay, tap} from "rxjs/operators";
import * as moment from "moment";
import {IAuthResponse} from "./IAuthResponse";
import {LoggingService} from "../logging/logging.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  loggedInUser: User = {
    uid: "",
    email: "",
    displayName: "",
    photoURL: "",
    emailVerified: false,
    accessToken: ""
  };

  constructor(
    private http: HttpClient,
    private logger: LoggingService,
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.SetUserData(user)
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }


  login(email: string, password: string) {
    this.logger.info("Authenticating: " + email)
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SetUserData(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      accessToken: user._delegate.accessToken
    };
    this.loggedInUser = userData;
  }


  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['auth']);
    });
  }

  get expirationTime() {
    return undefined;
  }

  get accessToken(): string {
    return this.loggedInUser.accessToken;
  }
}
