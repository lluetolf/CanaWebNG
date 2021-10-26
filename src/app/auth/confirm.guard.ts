import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable, of} from 'rxjs';
import {DashboardComponent} from "../dashboard/dashboard.component";

@Injectable({
  providedIn: 'root'
})
export class ConfirmGuard implements CanDeactivate<DashboardComponent> {
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.showConfirm();
  }

  private showConfirm(): Observable<boolean> {
    const confirmation = window.confirm('Are you sure?');
    return of(confirmation);
  }

}
