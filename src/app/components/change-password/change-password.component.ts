import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { CrudService } from 'src/app/services/crud.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  public loggedInUser: any;
  public confirmPassword: any = "";
  public userDetails: any = {
    OldPassword: "",
    NewPassword: null,
    DeviceId: "83e9568fa4df9fc1"
  }
  constructor(private crudService: CrudService, private router: Router, private spinner: NgxSpinnerService, private commonService: CommonService) {

  }

  changePassword() {
    this.spinner.show();
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.userDetails.MobileNo = this.loggedInUser.MobileNo;
    this.userDetails.Token = this.loggedInUser.Token;
    this.crudService.postByUrl('/ChangePassword', this.userDetails).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes("INVALID")) {
          this.commonService.emitSuccessErrorEventEmitter({message: res, success: false});
          return;
        }
        this.commonService.emitSuccessErrorEventEmitter({success: true});
        this.loggedInUser.IsActivated = true;
        sessionStorage.setItem('userDetails', JSON.stringify(this.loggedInUser));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: "Error!", success: false});
      }
    })
  }
}
