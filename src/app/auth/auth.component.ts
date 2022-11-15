import {Component, NgZone, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {LoggingService} from "../logging/logging.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: UntypedFormGroup;
  public loginInvalid = false;
  public loggingIn = false;
  public errorMessage = null;

  private returnUrl: string;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private logger: LoggingService,
    private ngZone: NgZone
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/init';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  login() {
    this.errorMessage = null;
    if (this.form.valid) {
      const val = this.form.value;
      this.loggingIn = true
      this.authService.login(val.username, val.password)
        .then(
          () => {
            this.logger.info(`User is logged in with ${this.authService.loggedInUser?.email}`);
            this.ngZone.run(() => {
              this.router.navigate(['/dashboard'])
            })
          },
          (err) => {
            this.errorMessage = err.message
            this.loginInvalid = true
          }
        ).finally(() => {
          this.loggingIn = false;
        }
      )
    }
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn) {
      this.logger.warn("Already logged in, going to /.");
      this.router.navigateByUrl('/');
    }
  }
}


