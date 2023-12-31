import { Component } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { CrudService } from 'src/app/services/crud.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
enum ProjectTypeEnum {
  angadiya = 2,
  account = 3,
  pnl = 4
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  public loggedInUser: any;
  public role: any = "angadiya";
  public accountStartDate: any = new Date();
  public maxDate: any = new Date();
  public userDetails: any = {
    MobileNo: "",
    DeviceId: "83e9568fa4df9fc1",
    Password: "admin",
    LoginId: "",
    City: ""
  }

  constructor(private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  reset() {
    this.userDetails.MobileNo = "";
    this.accountStartDate = new Date();
    this.role = "angadiya";
  }
  goToDashboard() {
    this.commonService.navigate(['/dashboard']);
  }
  create() {
    if (!this.commonService.isMobileValid(this.userDetails.MobileNo)) {
      this.commonService.emitSuccessErrorEventEmitter({success: false, message: "Invalid Mobile No."});
      return;
    }
    if (!this.commonService.isCityNameValid(this.userDetails.City)) {
      this.commonService.emitSuccessErrorEventEmitter({success: false, message: "Invalid City."});
      return;
    }
    this.userDetails.MobileNo = String(this.userDetails.MobileNo);
    this.userDetails.AccountStartDate = moment(this.accountStartDate).format('YYYY-MM-DD');
    this.userDetails.Token = this.loggedInUser.Token;
    this.userDetails.ProjectType = ProjectTypeEnum[this.role];
    this.userDetails.Name = this.userDetails.MobileNo;
    this.userDetails.LoginId = this.loggedInUser.Guid;
    this.spinner.show();
    this.crudService.postByUrl('/AdminCreate', this.userDetails).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({success: true});
        this.goToDashboard();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
}
