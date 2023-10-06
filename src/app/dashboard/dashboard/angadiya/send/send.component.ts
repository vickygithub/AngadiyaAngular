import { Component, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent {
  public date: any = new Date();
  public amount: any;
  public accountMasterList: any;
  public loggedInUser: any;
  public receiverGuid: any;
  public cities: any = [];
  public receiverCity: any;
  public receiverName: any;
  public receiverMobileNo: any;
  public receiverCharges: any;
  public noteNo: any;
  public senderGuid: any;
  public senderName: any;
  public senderMobileNo: any;
  public senderCharges: any;
  public remark: any;
  @Output() goToMainDashboard = new EventEmitter<any>();
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService) { }
  fetchAccountList() {
    this.spinner.show();
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.crudService.postByUrl('/AccountList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.accountMasterList = res;
        this.accountMasterList.sort((a: any, b: any) => {
          // Use the localeCompare method to perform a case-insensitive string comparison
          return a.Name.localeCompare(b.Name);
        });
        this.reset();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
  fetchCities() {
    const params = {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid
    }
    this.crudService.postByUrl('/CityList', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.cities = [...res];
        this.cities.sort((a: any, b: any) => {
          // Use the localeCompare method to perform a case-insensitive string comparison
          return a.Name.localeCompare(b.Name);
        });
        if (this.cities.length > 0) {
          this.receiverCity = this.cities[0].Guid;
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
  ngOnInit() {
    this.fetchAccountList();
    this.fetchCities();
  }
  
  reset() {
    const receiverList = this.accountMasterList.filter((a: any) => a.Type.toLowerCase() === 'angadiya');
    this.receiverGuid = receiverList.length ? receiverList[0].Guid : null;

    const senderList = this.accountMasterList.filter((a: any) => a.Type.toLowerCase() === 'cash' || a.Type.toLowerCase() === 'client');
    this.senderGuid = senderList.find((s: any) => s.Type.toLowerCase() === 'cash').Guid;
    if (this.cities.length > 0) {
      this.receiverCity = this.cities[0].Guid;
    }

    this.date = new Date();
    this.amount = null;
    this.receiverName = null;
    this.receiverMobileNo = null;
    this.receiverCharges = null;
    this.noteNo  = null;
    this.senderName = null;
    this.senderMobileNo = null;
    this.senderCharges = null;
    this.remark = null;
  }
 
  save() {
    if (this.amount == null || this.date == null || this.receiverGuid == null || this.receiverCity == null || this.receiverName == null || this.receiverName == '' || this.senderGuid == null || !this.commonService.isMobileValid(this.receiverMobileNo) || (this.senderMobileNo != null && !this.commonService.isMobileValid(this.senderMobileNo)))   {
      return;
    }

    this.spinner.show();
    const params = {
      TranDate: moment(this.date).format('YYYY-MM-DD'),
      Amount: "" + this.amount.toFixed(2),
      ReceiverGuid: this.receiverGuid,
      ReceiverCity: this.receiverCity,
      ReceiverName: this.receiverName,
      ReceiverMobileNo: String(this.receiverMobileNo),
      ReceiverCharges: "" + (this.receiverCharges || 0),
      NoteNo: this.noteNo || "",
      SenderGuid: this.senderGuid,
      SenderName: this.senderName || "",
      SenderMobileNo: String(this.senderMobileNo),
      SenderCharges: "" + (this.senderCharges || 0),
      Remark: this.remark || "",
      SenderCity: "",
      LoginId: this.loggedInUser.Guid,
      AdminGuid: this.loggedInUser.AdminGuid,
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1",
      Commission: ""
    }

    this.crudService.postByUrl('/SendTransaction', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.commonService.openSnackBar(res);
        this.reset();
        this.goToMainDashboard.emit();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
}
