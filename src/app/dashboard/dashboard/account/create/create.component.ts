import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  public name: any;
  public openingBalance: any = 0;
  public mobile: any;
  public type: any = "Angadiya";
  public loggedInUser: any;
  public city: any;
  public selfName: any;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private router: Router, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  save() {
    
    if (this.name == null || this.name == "" || this.type == null) {
      this.commonService.emitSuccessErrorEventEmitter({message: 'Enter Name', success: false});
      return;
    }
    // if not bookie
    if (this.loggedInUser.ProjectType !== 4) {
      if ((this.type.toLowerCase() === 'angadiya' || this.type.toLowerCase() === 'client') && !this.commonService.isMobileValid(this.mobile) && (this.city == '' || this.city == null)) {
        this.commonService.emitSuccessErrorEventEmitter({message: 'Mobile or City Invalid', success: false});
        return;
      }
      if ((this.type.toLowerCase() === 'angadiya' || this.type.toLowerCase() === 'client') && !this.commonService.isCityNameValid(this.city)) {
        this.commonService.emitSuccessErrorEventEmitter({message: 'City Invalid', success: false});
        return;
      }
      if (this.type.toLowerCase() === 'angadiya' && (this.selfName == null || this.selfName == '')) {
        this.commonService.emitSuccessErrorEventEmitter({message: 'Enter all (*) details', success: false});
        return;
      }
    }
   
    this.spinner.show();
    let params = {
      Name: this.name,
      OpeningBalance: this.openingBalance == null ? "0" : "" + this.openingBalance.toFixed(2),
      MobileNo: this.mobile == null ? this.loggedInUser.MobileNo : String(this.mobile),
      Type: this.type,
      LoginId: this.loggedInUser.Guid,
      AdminGuid: this.loggedInUser.AdminGuid,
      SuperAdminGuid: this.loggedInUser.CreatedBy,
      Token: this.loggedInUser.Token,
      DeviceId: '83e9568fa4df9fc1',
      Active: "",
      Guid: "",
      City: this.city == null || this.city == '' ? this.loggedInUser.City : this.city,
      SelfName: this.selfName || ''
    }
    // Bookie condition to hide mobile and selfName
    if (this.loggedInUser.ProjectType === 4) {
      params.MobileNo = 'NA';
      params.SelfName = 'NA';
      params.City = '';
    }
    this.crudService.postByUrl('/AccountCreate', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Already')) {
          this.commonService.emitSuccessErrorEventEmitter({message: res, success: false});
          return;
        }
        this.commonService.emitSuccessErrorEventEmitter({success: true});
        this.back();
      },
      error: (err) => {
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
        this.spinner.hide();
      }
    })
  }

  back() {
    this.router.navigate(['/dashboard/account']);
  }
}
