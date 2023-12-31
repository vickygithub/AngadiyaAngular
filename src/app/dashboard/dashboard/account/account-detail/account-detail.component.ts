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
  public loggedInUser: any;
  constructor(private router: Router, private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  ngOnInit() {
    this.existingAccountMaster = history.state;
  }

  update() {
    if (this.loggedInUser.ProjectType !== 4) {
      if (!this.commonService.isMobileValid(this.existingAccountMaster.MobileNo)) {
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Invalid Mobile No.', success: false });
        return;
      }
      if (!this.commonService.isCityNameValid(this.existingAccountMaster.City)) {
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Invalid City.', success: false });
        return;
      }
      if (this.existingAccountMaster.Type.toLowerCase() === 'angadiya' && (this.existingAccountMaster.SelfName == null || this.existingAccountMaster.SelfName == '')) {
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Invalid Self name.', success: false });
        return;
      }
    }
    
    this.spinner.show();
    const params = {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      Name: this.existingAccountMaster.Name,
      OpeningBalance: `${this.existingAccountMaster.OpeningBalance.toFixed(2)}`,
      MobileNo: String(this.existingAccountMaster.MobileNo),
      Type: this.existingAccountMaster.Type,
      LoginId: this.loggedInUser.Guid,
      AdminGuid: this.existingAccountMaster.AdminGuid,
      SuperAdminGuid: this.existingAccountMaster.SupperAdminGuid,
      Active: "TRUE",
      Guid: this.existingAccountMaster.Guid,
      City: this.existingAccountMaster.City,
      SelfName: this.existingAccountMaster.SelfName || ''
    };
    // Bookie condition to hide mobile and selfName
    if (this.loggedInUser.ProjectType === 4) {
      params.MobileNo = 'NA';
      params.SelfName = 'NA';
      params.City = '';
    }
    this.crudService.postByUrl('/AccountEdit', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Already')) {
          this.commonService.emitSuccessErrorEventEmitter({message: res, success: false});
          return;
        }
        if ((typeof res) == "string") {
          this.commonService.emitSuccessErrorEventEmitter({ success: true });
        }
        this.back();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  back() {
    this.router.navigate(['/dashboard/account']);
  }
}
