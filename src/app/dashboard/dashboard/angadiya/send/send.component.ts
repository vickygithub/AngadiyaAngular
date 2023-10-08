import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent {
  public actionLabel: any = "Save";
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
  @Input() existingSendDetails: any;
  public citySubjectNotifier = new Subject<any>();
  public citySubject: Subscription;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {

    this.citySubject = this.citySubjectNotifier.subscribe((res: any) => {
      if (this.existingSendDetails.Guid != null) {
        this.receiverCity = this.cities.find((c: any) => c.Name.toLowerCase().replace(/\s/g, '') === this.existingSendDetails.ReceiverCity.toLowerCase().replace(/\s/g, '')).Guid;
      }
    });


  }

  ngOnDestroy() {
    this.citySubjectNotifier.unsubscribe();
  }
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
        if (this.existingSendDetails.Guid == null) {
          this.reset();
        }
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
        this.citySubjectNotifier.next(true);
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
    if (this.existingSendDetails.Guid != null) {
      this.date = this.commonService.getDatePickerDate(this.existingSendDetails.TranDate);
      
      this.amount = this.existingSendDetails.Amount;
      this.receiverGuid = this.existingSendDetails.ReceiverGuid;

      this.receiverName = this.existingSendDetails.ReceiverName;
      this.receiverMobileNo = this.existingSendDetails.ReceiverMobileNo;
      this.receiverCharges = this.existingSendDetails.ReceiveCharges;
      this.noteNo = this.existingSendDetails.NoteNo;
      this.senderGuid = this.existingSendDetails.SenderGuid;
      this.senderName = this.existingSendDetails.SenderName;
      this.senderMobileNo = this.existingSendDetails.senderMobileNo;
      this.senderCharges = this.existingSendDetails.SendCharges;
      this.remark = this.existingSendDetails.Remark;

      this.actionLabel = "Update";
    }
  }
  deleteTran() {
    this.spinner.show()
    const params = {
      Amount: "0",
      SenderName: "",
      SenderMobileNo: "",
      SenderCharges: "0",
      ReceiverName: "",
      ReceiverMobileNo: "",
      ReceiverCharges: "0",
      Remark: "",
      NoteNo: "",
      LoginId: "",
      SenderCity: "",
      ReceiverCity: "",
      TranDate: moment(this.date).format('YYYY-MM-DD'),
      SenderGuid: this.senderGuid,
      ReceiverGuid: this.receiverGuid,
      AdminGuid: this.loggedInUser.AdminGuid,
      TranGuid: this.existingSendDetails.Guid,
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1" 
    }
    
    this.crudService.postByUrl('/DeleteSendReceiveData', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.commonService.openSnackBar(res);
        if (res.includes('Successful')) {
          this.router.navigate(['/dashboard/ledger']);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error in deleting Transaction!");
      }
    })
    
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
    this.noteNo = null;
    this.senderName = null;
    this.senderMobileNo = null;
    this.senderCharges = null;
    this.remark = null;
  }

  save() {
    if (this.amount == null || this.date == null || this.receiverGuid == null || this.receiverCity == null || this.receiverName == null || this.receiverName == '' || this.senderGuid == null || !this.commonService.isMobileValid(this.receiverMobileNo) || (this.senderMobileNo != null && !this.commonService.isMobileValid(this.senderMobileNo))) {
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
