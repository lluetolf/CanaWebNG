import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  showPasswordHint: boolean = false;
  loginForm = this.builder.group({
    username: ['', Validators.required],
    password: ['',
      [Validators.required, Validators.minLength(6)]
    ]
  });




  get username(): AbstractControl {
    return this.loginForm.controls.username;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
  }

  login() {
    const controls = this.loginForm.controls;
    console.log('User: ' + controls.username.value);
    console.log('Password: ' + controls.password.value);
  }
}
