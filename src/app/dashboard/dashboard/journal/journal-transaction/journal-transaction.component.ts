import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-journal-transaction',
  templateUrl: './journal-transaction.component.html',
  styleUrls: ['./journal-transaction.component.scss']
})
export class JournalTransactionComponent {
  public date: any = new Date();
  public amount: any;
  public remark: any;
  public loggedInUser: any;
  public debitGuid: any;
  public creditGuid: any;
  public options: any = [];
  public maxDate: any = new Date();
  public existingCrDetails: any;
  public actionLabel: string = 'Save';
  public accountListSubjectNotifier = new Subject<any>();
  public accountListSubject: Subscription;
  public originalExistingData: any;
  constructor(private spinner: NgxSpinnerService, private router: Router, private crudService: CrudService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.existingCrDetails = history.state;
    this.accountListSubject = this.accountListSubjectNotifier.subscribe((res: any) => {
      if (this.existingCrDetails.Guid != null) {
        this.creditGuid = this.options.find((c: any) => c.Guid === this.existingCrDetails.CreditGuid).Guid;
        this.debitGuid = this.options.find((c: any) => c.Guid === this.existingCrDetails.DebitGuid).Guid;

        //store delete data 
        const deleteData = {
          date: moment(this.date).format('YYYY-MM-DD'),
          debitGuid: this.debitGuid,
          creditGuid: this.creditGuid
        }
        this.originalExistingData = JSON.stringify(deleteData);
      }
    });
  }
  ngOnDestory() {
    this.accountListSubjectNotifier.unsubscribe();
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
  ngOnInit() {
    this.fetchAccountList();
    if (this.existingCrDetails.Guid != null) {
      this.date = this.commonService.getDatePickerDate(this.existingCrDetails.TranDate);
      this.amount = this.existingCrDetails.Amount;
      this.remark = this.existingCrDetails.Remark;
      this.actionLabel = 'Update';
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
        this.options = res;
        if (this.existingCrDetails.Guid != null) {
          this.accountListSubjectNotifier.next(true);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
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
      TranGuid: this.existingCrDetails.Guid,
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1"
    }
    this.crudService.postByUrl('/DeleteJournalData', params).subscribe({
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
    });
  }
  save(isUpdate: boolean = false) {
    if (this.date == null || this.amount == null || this.debitGuid == null || this.creditGuid == null || this.amount < 0 || this.amount == null) {
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
      AdminGuid: this.loggedInUser.AdminGuid,
      Amount: "" + this.amount.toFixed(2),
      Commission: "",
      DeviceId: "83e9568fa4df9fc1",
      LoginId: this.loggedInUser.Guid,
      NoteNo: "NA",
      ReceiverCharges: "0",
      ReceiverCity: "NA",
      CreditGuid: this.creditGuid,
      ReceiverMobileNo: "0",
      ReceiverName: "NA",
      Remark: this.remark || "",
      SenderCharges: "0",
      SenderCity: "NA",
      DebitGuid: this.debitGuid,
      SenderMobileNo: "0",
      SenderName: "NA",
      Token: this.loggedInUser.Token,
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }
    this.spinner.show();
    this.crudService.postByUrl('/JournalTransaction', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
}
