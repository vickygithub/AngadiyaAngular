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
  public actionLabel: any = "Submit";
  public date: any = new Date();
  public amount: any;
  public accountMasterList: any;
  public loggedInUser: any;
  public creditGuid: any;
  public cities: any = [];
  public receiverCity: any;
  public receiverName: any;
  public receiverMobileNo: any;
  public receiverCharges: any;
  public noteNo: any;
  public debitGuid: any;
  public senderName: any;
  public senderMobileNo: any;
  public senderCharges: any;
  public remark: any;
  public originalExistingData: any;
  public maxDate: any = new Date();
 
  @Output() goToMainDashboard = new EventEmitter<any>();
  @Output() getCityNameForPdf = new EventEmitter<any>();
  @Input() existingSendDetails: any;
  public citySubjectNotifier = new Subject<any>();
  public citySubject: Subscription;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {

    this.citySubject = this.citySubjectNotifier.subscribe((res: any) => {
      if (this.existingSendDetails.Guid != null) {
        let cityNameForPdf: any;
        if (this.existingSendDetails.fromAngadiyaList === true) {
          this.receiverCity = this.existingSendDetails.ReceiverCity;
          cityNameForPdf = this.cities.find((c: any) => c.Guid === this.existingSendDetails.ReceiverCity).Name;
        } else {
          this.receiverCity = this.cities.find((c: any) => c.Name.toLowerCase().replace(/\s/g, '') === this.existingSendDetails.ReceiverCity.toLowerCase().replace(/\s/g, '')).Guid;
        }
        this.getCityNameForPdf.emit(cityNameForPdf);
        
      }
    });


  }

  ngOnDestroy() {
    if (this.citySubjectNotifier) {
      this.citySubjectNotifier.unsubscribe();
    }
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
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
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
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  ngOnInit() {
    this.fetchAccountList();
    this.fetchCities();
    if (this.existingSendDetails.Guid != null) {
      this.date = this.commonService.getDatePickerDate(this.existingSendDetails.TranDate);

      this.amount = this.existingSendDetails.Amount.toFixed(2);
      this.creditGuid = this.existingSendDetails.CreditGuid;

      this.receiverName = this.existingSendDetails.ReceiverName1 || this.existingSendDetails.ReceiverName;
      this.receiverMobileNo = this.existingSendDetails.ReceiverMobileNo;
      this.receiverCharges = this.existingSendDetails.ReceiveCharges.toFixed(2);
      this.noteNo = this.existingSendDetails.NoteNo;
      this.debitGuid = this.existingSendDetails.DebitGuid;
      this.senderName = this.existingSendDetails.SennderName;
      this.senderMobileNo = this.existingSendDetails.SenderMobileNo == "null" ? "" : this.existingSendDetails.SenderMobileNo;
      this.senderCharges = this.existingSendDetails.SendCharges.toFixed(2);
      this.remark = this.existingSendDetails.Remark;

      this.actionLabel = "Update";


      //store delete data 
      const deleteData = {
        date: moment(this.date).format('YYYY-MM-DD'),
        debitGuid: this.debitGuid,
        creditGuid: this.creditGuid
      }
      this.originalExistingData = JSON.stringify(deleteData);
    }
  }

  deleteTran(isUpdate: boolean = false) {
    this.spinner.show();
    const deleteData = JSON.parse(this.originalExistingData);
    let params = {
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
      TranDate: deleteData.date,
      DebitGuid: deleteData.debitGuid,
      CreditGuid: deleteData.creditGuid,
      AdminGuid: this.loggedInUser.AdminGuid,
      TranGuid: this.existingSendDetails.Guid,
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1"
    }

    this.crudService.postByUrl('/DeleteSendReceiveData', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Successful')) {

          if (isUpdate) {
            this.submitTran();
          } else {
            this.commonService.emitSuccessErrorEventEmitter({ success: true });
            this.router.navigate(['/dashboard/main']);
          }
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })

  }
  reset() {
    const receiverList = this.accountMasterList.filter((a: any) => a.Type.toLowerCase() === 'angadiya');
    this.creditGuid = receiverList.length ? receiverList[0].Guid : null;

    const senderList = this.accountMasterList.filter((a: any) => a.Type.toLowerCase() === 'cash' || a.Type.toLowerCase() === 'client');
    this.debitGuid = senderList.find((s: any) => s.Type.toLowerCase() === 'cash').Guid;
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

  save(isUpdate: boolean = false) {
    if (this.amount == null || this.date == null || this.creditGuid == null || this.receiverCity == null || this.receiverName == null || this.receiverName == '' || this.debitGuid == null || !this.commonService.isMobileValid(this.receiverMobileNo)) {
      this.commonService.emitSuccessErrorEventEmitter({ message: 'Enter all (*) details', success: false });
      return;
    }
    if (this.senderMobileNo != null && this.senderMobileNo != '' && !this.commonService.isMobileValid(this.senderMobileNo)) {
      this.commonService.emitSuccessErrorEventEmitter({ message: 'Invalid Sender Mobile', success: false });
      return;
    }
    if (isUpdate) {
      this.deleteTran(isUpdate);
    } else {
      this.submitTran();
    }

  }

  submitTran() {
    this.spinner.show();
    const params = {
      TranDate: moment(this.date).format('YYYY-MM-DD'),
      Amount: "" + parseFloat(this.amount).toFixed(2),
      CreditGuid: this.creditGuid,
      ReceiverCity: this.receiverCity,
      ReceiverName: this.receiverName,
      ReceiverMobileNo: String(this.receiverMobileNo),
      ReceiverCharges: "" + (parseFloat(this.receiverCharges) || 0).toFixed(2),
      NoteNo: this.noteNo || "",
      DebitGuid: this.debitGuid,
      SenderName: this.senderName || "",
      SenderMobileNo: String(this.senderMobileNo),
      SenderCharges: "" + (parseFloat(this.senderCharges) || 0).toFixed(2),
      Remark: this.remark || "",
      SenderCity: "",
      LoginId: this.loggedInUser.Guid,
      AdminGuid: this.loggedInUser.AdminGuid,
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1",
      Commission: "",
      TranType: 'SEND'
    }

    this.crudService.postByUrl('/SendTransaction', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ success: true });
        this.goToMainDashboard.emit();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
}
