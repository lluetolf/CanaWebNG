import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public env: String;
  public buildTime: String;
  public commitSha: String;
  public branchName: String;

  constructor() {
    this.env = environment.release.env
    this.buildTime = environment.release.buildTime
    this.commitSha = environment.release.commitSha
    this.branchName = environment.release.branchName
  }

}
