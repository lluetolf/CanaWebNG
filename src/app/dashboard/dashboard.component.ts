import {Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';
import {PayableService} from "../payable/payable.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public env: String;
  public buildTime: String;
  public commitSha: String;
  public branchName: String;

  constructor(private payableService: PayableService) {
    this.env = environment.release.env
    this.buildTime = environment.release.buildTime
    this.commitSha = environment.release.commitSha
    this.branchName = environment.release.branchName
  }

  ngOnInit(): void {
    this.payableService.getTotalPerMonth();
  }

}
