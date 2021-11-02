import { Component } from '@angular/core';
import {AuthService} from "../auth/auth.service";


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  constructor(private authService: AuthService) {}

  notLoggedIn() {
    return this.authService.isLoggedOut()
  }
}
