import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent {
  public existingAccountMaster: any;
  constructor(private router: Router, private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService){}

  ngOnInit() {
    this.existingAccountMaster = history.state;
  }

  update() {
    if (!this.commonService.isMobileValid(this.existingAccountMaster.MobileNo)) {
      return;
    }
    this.spinner.show();
    const loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.crudService.postByUrl('/AccountEdit', {
      DeviceId: "83e9568fa4df9fc1",
      Token: loggedInUser.Token,
      Name: this.existingAccountMaster.Name,
      OpeningBalance: `${this.existingAccountMaster.OpeningBalance.toFixed(2)}`,
      MobileNo: String(this.existingAccountMaster.MobileNo),
      Type: this.existingAccountMaster.Type,
      LoginId: loggedInUser.Guid,
      AdminGuid: this.existingAccountMaster.AdminGuid,
      SuperAdminGuid: this.existingAccountMaster.SupperAdminGuid,
      Active: "TRUE",
      Guid: this.existingAccountMaster.Guid
}).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if ((typeof res) == "string") {
          this.commonService.openSnackBar(res);
        }
        this.back();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
  back() {
    this.router.navigate(['/dashboard/account']);
  }
}
