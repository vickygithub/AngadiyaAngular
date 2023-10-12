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
  @Input() existingCrDetails: any;
  @Input() tranType: any;
  public accountListSubjectNotifier = new Subject<any>();
  public accountListSubject: Subscription;
  constructor(private spinner: NgxSpinnerService, private router: Router, private crudService: CrudService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);

    this.accountListSubject = this.accountListSubjectNotifier.subscribe((res: any) => {
      if (this.existingCrDetails.Guid != null) {
        this.creditGuid = this.options.find((c: any) => c.Guid === this.existingCrDetails.CreditGuid).Guid;
        this.debitGuid = this.options.find((c: any) => c.Guid === this.existingCrDetails.DebitGuid).Guid;
      }
    });
  }
  ngOnDestory() {
    this.accountListSubjectNotifier.unsubscribe();
  }
  ngOnInit() {
    this.fetchAccountList();
    if (this.existingCrDetails.Guid != null) {
      this.date = this.commonService.getDatePickerDate(this.existingCrDetails.TranDate);
      this.amount = this.existingCrDetails.Amount;
      this.remark = this.existingCrDetails.Remark;
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

  save() {
    if (this.date == null || this.amount == null || this.debitGuid == null || this.creditGuid == null || this.amount < 0 || this.amount == null) {
      return;
    }
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
