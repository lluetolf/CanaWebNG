import {Component, OnInit} from '@angular/core';
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

  public get loginInvalid() {
    return this.errorMessage != ""
  };

  get loggingIn$() {
    return this.authService.loggingIn$
  }

  public errorMessage: String = "";

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private logger: LoggingService) {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.valid) {
      const val = this.form.value;
      this.authService.login(val.username, val.password).then(
        () => {
          this.router.navigateByUrl('/dashboard')
        },
        (err) => {
          this.errorMessage = "Error: " + err.message
        }
      )
    }
  }

  ngOnInit(): void {
      if (this.authService.isLoggedIn) {
        this.logger.warn("Already logged in, going to /.");
        this.router.navigateByUrl('/dashboard');
      } else {
        this.logger.info("Display log in form.")
      }
  }
}


