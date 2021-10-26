import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  showPasswordHint: boolean = true;

  loginForm = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl('')
    }
  );

  get username(): AbstractControl {
    return this.loginForm.controls.username;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    const controls = this.loginForm.controls;
    console.log('User: ' + controls.username.value);
    console.log('Password: ' + controls.password.value);
  }
}
