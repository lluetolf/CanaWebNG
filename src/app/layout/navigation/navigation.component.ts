import { Component } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn() {
    return this.authService.isLoggedIn
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/auth')
  }
}
