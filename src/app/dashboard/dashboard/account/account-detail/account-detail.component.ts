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
    console.log("history.state", history.state)
    this.existingAccountMaster = history.state;
  }

  update() {
    this.spinner.show();
    const loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.crudService.postByUrl('/AccountEdit', {
      DeviceId: "5c1e2fcc27ce7a8e",
      Token: loggedInUser.Token,
      Name: this.existingAccountMaster.Name,
      OpeningBalance: `${this.existingAccountMaster.OpeningBalance}`,
      MobileNo: this.existingAccountMaster.MobileNo,
      Type: this.existingAccountMaster.Type,
      LoginId: loggedInUser.Guid,
      AdminGuid: this.existingAccountMaster.AdminGuid,
      SupperAdminGuid: this.existingAccountMaster.SupperAdminGuid,
      Active: "TRUE",
      Guid: this.existingAccountMaster.Guid
}).subscribe({
      next: (res: any) => {
        console.log("Res", res);
        this.spinner.hide();
        if ((typeof res) == "string") {
          this.commonService.openSnackBar(res);
        }
        this.back();
      },
      error: (err) => {
        console.log("err");
        this.spinner.hide();
      }
    })
  }
  back() {
    this.router.navigate(['/dashboard/account']);
  }
}
