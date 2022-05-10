import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  AngularFirestore,
} from "@angular/fire/compat/firestore";


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
    public router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.setLoggedInUser(user)
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      } else {
        localStorage.removeItem("user")
      }
    });
    var tmp = localStorage.getItem("user")
    if(tmp && tmp != "null") {
      this.setLoggedInUser(JSON.parse(tmp));
    }
  }



  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null || this.loggedInUser.accessToken != "";
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }


  login(email: string, password: string) {
    this.logger.info("Authenticating: " + email)
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setLoggedInUser(result.user);
      })
      .catch((error) => {
        this.logger.error(error.message);
        throw error;
      });
  }

  setLoggedInUser(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      accessToken: user._delegate?.accessToken || user.accessToken
    };
    this.loggedInUser = userData;
  }


  logout() {
    return this.afAuth.signOut().then(() => {
      const tmp: User = {
        uid: "",
        email: "",
        displayName: "",
        photoURL: "",
        emailVerified: false,
        accessToken: ""
      };
      this.loggedInUser = tmp;
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
