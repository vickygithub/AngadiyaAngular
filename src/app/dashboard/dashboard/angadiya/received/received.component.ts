import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss']
})
export class ReceivedComponent {
  public date: any = new Date();
  public amount: any;
  public loggedInUser: any;
  public accountMasterList: any;
  public debitAccount: any;
  public fromCity: any;
  public senderName: any;
  public senderMobileNo: any;
  public commissionFromAngadiya: any;
  public noteNo: any;
  public creditAccount: any;
  public receiverMobileNo: any;
  public receiverName: any;
  public chargesFromReceiver: any;
  public remark: any;
  public actionLabel: any = 'Submit';
  public maxDate: any = new Date();
  @Output() goToMainDashboard = new EventEmitter<any>();
  @Input() existingSendDetails: any;
  public subjectNotifier = new Subject<any>();
  public debitCreditSubject: Subscription;
  public originalExistingData: any;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.debitCreditSubject = this.subjectNotifier.subscribe((res: any) => {
      this.debitAccount = this.accountMasterList.find((a: any) => a.Guid === this.existingSendDetails.DebitGuid);
      this.fromBranchChangeEvent();
      this.creditAccount = this.accountMasterList.find((a: any) => a.Guid === this.existingSendDetails.CreditGuid);

      //store delete data 
      const deleteData = {
        date: moment(this.date).format('YYYY-MM-DD'),
        debitGuid: this.debitAccount.Guid,
        creditGuid: this.creditAccount.Guid
      }
      this.originalExistingData = JSON.stringify(deleteData);
    })
  }
  fetchAccountList() {
    this.spinner.show();
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
        this.creditAccount = this.accountMasterList.find((a: any) => a.Type.toLowerCase() === 'cash');
        if (this.existingSendDetails.Guid != null) {
          this.subjectNotifier.next(true);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  fromBranchChangeEvent() {
    this.fromCity = this.debitAccount.City;
  }
  ngOnInit() {
    this.fetchAccountList();
    if (this.existingSendDetails.Guid != null) {
      this.date = this.commonService.getDatePickerDate(this.existingSendDetails.TranDate);
      this.amount = this.existingSendDetails.Amount.toFixed(2);


      this.receiverName = this.existingSendDetails.ReceiverName1 || this.existingSendDetails.ReceiverName;
      this.receiverMobileNo = this.existingSendDetails.ReceiverMobileNo;
      this.chargesFromReceiver = this.existingSendDetails.ReceiveCharges.toFixed(2);
      this.noteNo = this.existingSendDetails.NoteNo;

      this.senderName = this.existingSendDetails.SennderName;
      this.senderMobileNo = this.existingSendDetails.senderMobileNo;
      this.commissionFromAngadiya = this.existingSendDetails.SendCharges.toFixed(2);
      this.remark = this.existingSendDetails.Remark;

      this.actionLabel = "Update";

    }
  }
  deleteTran(isUpdate: boolean = false) {

    this.spinner.show();
    const deleteData = JSON.parse(this.originalExistingData);
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
            this.router.navigate(['/dashboard/ledger']);
          }
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }

    })

  }
  async save(isUpdate: boolean = false) {
    if (this.amount == null || this.date == null || this.debitAccount == null || (this.senderMobileNo != null && !this.commonService.isMobileValid(this.senderMobileNo)) || this.commissionFromAngadiya == null || this.commissionFromAngadiya === "") {
      return;
    }
    if (this.creditAccount.Type.toLowerCase() === 'cash' && (this.receiverName == null || this.receiverName == "")) {
      this.commonService.emitSuccessErrorEventEmitter({ message: 'Enter all (*) details', success: false });
      return;
    }
    if (this.creditAccount.Type.toLowerCase() === 'cash' && !this.commonService.isMobileValid(this.receiverMobileNo)) {
      this.commonService.emitSuccessErrorEventEmitter({ message: 'Enter all (*) details', success: false });
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
      DebitGuid: this.debitAccount.Guid,
      SenderName: this.senderName || "",
      SenderMobileNo: this.senderMobileNo || "0",
      SenderCharges: "" + (parseFloat(this.commissionFromAngadiya) || 0).toFixed(2),
      SenderCity: this.fromCity,
      CreditGuid: this.creditAccount.Guid,
      ReceiverName: this.receiverName || this.creditAccount.Name,
      ReceiverMobileNo: this.receiverMobileNo || this.creditAccount.MobileNo,
      ReceiverCharges: "" + (parseFloat(this.chargesFromReceiver) || 0).toFixed(2),
      ReceiverCity: this.creditAccount.City,
      Remark: this.remark || "",
      NoteNo: this.noteNo || "",
      LoginId: this.loggedInUser.Guid,
      AdminGuid: this.loggedInUser.AdminGuid,
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1",
      Commission: "",
      TranType: 'RECEIVE'
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
