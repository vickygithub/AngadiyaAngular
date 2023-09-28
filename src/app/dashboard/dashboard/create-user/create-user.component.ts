import { Component } from '@angular/core';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from "ngx-spinner";
import { CrudService } from 'src/app/services/crud.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
enum ProjectTypeEnum {
  angadiya = 2,
  account = 3
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
  public userDetails: any = {
    MobileNo: "",
    DeviceId: "5c1e2fcc27ce7a8e",
    Password: "admin",
    LoginId: uuidv4()
  }

  constructor(private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  reset() {
    this.userDetails.MobileNo = "";
    this.accountStartDate = new Date();
    this.role = 2;
  }
  goToDashboard() {
    this.commonService.navigate(['/dashboard']);
  }
  create() {
    if (!/^[0-9]{10}$/.test(this.userDetails.MobileNo) || this.userDetails.MobileNo.length < 10) {
      this.commonService.openSnackBar("Invalid Number");
      return;
    }
    this.userDetails.AccountStartDate = moment(this.accountStartDate).format('YYYY-MM-DD hh:mm:ss');
    this.userDetails.Token = this.loggedInUser.Token;
    this.userDetails.ProjectType = ProjectTypeEnum[this.role];
    this.userDetails.Name = this.userDetails.MobileNo;
    console.log(this.userDetails)
    this.spinner.show();
    this.crudService.postByUrl('/AdminCreate', this.userDetails).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        console.log("res", res);
        this.commonService.openSnackBar(res);
        this.reset();
      },
      error: (err) => {
        console.log("err");
        this.spinner.hide();
      }
    })
  }
}
