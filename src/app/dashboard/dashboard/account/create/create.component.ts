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
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private router: Router, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  save() {
    
    if (this.name == null || this.name == "" || this.type == null) {
      return;
    }
    if ((this.type.toLowerCase() === 'angadiya' || this.type.toLowerCase() === 'client') && !this.commonService.isMobileValid(this.mobile) && (this.city == '' || this.city == null)) {
      return;
    }
    if ((this.type.toLowerCase() === 'angadiya' || this.type.toLowerCase() === 'client') && !this.commonService.isCityNameValid(this.city)) {
      return;
    }
   
    this.spinner.show();
    const params = {
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
      City: this.city == null || this.city == '' ? this.loggedInUser.City : this.city
    }
    this.crudService.postByUrl('/AccountCreate', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
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
