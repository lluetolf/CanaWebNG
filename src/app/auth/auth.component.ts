import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {LoggingService} from "../logging/logging.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: FormGroup;
  public loginInvalid = false;
  public errorMessage = null;

  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private logger: LoggingService
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.form.value;
    this.errorMessage = null;

    if (val.username && val.password) {
      this.authService.login(val.username, val.password)
        .subscribe({
          next: () => {
            this.logger.info("User is logged in");
            this.router.navigateByUrl('/');
          },
          error: error => {
            this.errorMessage = error.message
            this.logger.error(error.message)
            this.loginInvalid = true
          }
        })
    }
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.logger.warn("Already logged in, going to /.");
      this.router.navigateByUrl('/');
    }
  }
}


