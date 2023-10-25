import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-pnl',
  templateUrl: './pnl.component.html',
  styleUrls: ['./pnl.component.scss']
})
export class PnlComponent {
  public date = new Date();
  public amount: any;
  public options: any = [];
  public receivedFrom: any;
  public remark: any;
  public loggedInUser: any;
  public maxDate: any = new Date();
  @Input() existingCrDetails: any;
  @Input() tranType: any;
  public actionLabel: any = 'Save';
  public accountListSubjectNotifier = new Subject<any>();
  public accountListSubject: Subscription;
  public originalExistingData: any;
  constructor(private spinner: NgxSpinnerService, private router: Router, private crudService: CrudService, private commonService: CommonService) {
    this.accountListSubject = this.accountListSubjectNotifier.subscribe((res: any) => {
      if (this.existingCrDetails.Guid != null) {
        if (this.existingCrDetails.TransitionType.toLowerCase() === 'profit') {
          this.receivedFrom = this.options.find((c: any) => c.Guid === this.existingCrDetails.CreditGuid);
        } else { 
          this.receivedFrom = this.options.find((c: any) => c.Guid === this.existingCrDetails.DebitGuid);
        }

        //store delete data 
        const senderGuid = this.options.find((o: any) => o.Type.toLowerCase() === "pnl").Guid;
        const deleteData = {
          date: moment(this.date).format('YYYY-MM-DD'),
          debitGuid: this.existingCrDetails.TransitionType.toLowerCase() === 'profit' ? senderGuid : this.receivedFrom.Guid,
          creditGuid: this.existingCrDetails.TransitionType.toLowerCase() === 'profit' ? this.receivedFrom.Guid : senderGuid
        }
        this.originalExistingData = JSON.stringify(deleteData);
      }
    });
  }
  ngOnDestory() {
    this.accountListSubjectNotifier.unsubscribe();
  }
  displayFn(event: any) {
    return event && event.Name ? event.Name : '';
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
    });
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
          this.date = this.commonService.getDatePickerDate(this.existingCrDetails.TranDate);
          this.amount = this.existingCrDetails.Amount;
          this.remark = this.existingCrDetails.Remark;

          this.actionLabel = "Update";
          this.accountListSubjectNotifier.next(true);
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }

  ngOnInit() {
    this.fetchAccountList();
  }
  reset() {
    this.date = new Date();
    this.amount = null;
    this.receivedFrom = null;
    this.remark = null;
  }


  save(isUpdate: boolean = false) {
    if (this.date == null || this.amount == null || this.receivedFrom == null) {
      return;
    }
    if (this.amount < 0) {
      return;
    }
    if (isUpdate) {
      this.deleteTran(isUpdate);
    } else {
      this.submitTran();
    }

  }

  submitTran() {
    const senderGuid = this.options.find((o: any) => o.Type.toLowerCase() === "pnl").Guid;
    let params = {
      AdminGuid: this.loggedInUser.AdminGuid,
      Amount: "" + this.amount.toFixed(2),
      Commission: "",
      DeviceId: "83e9568fa4df9fc1",
      LoginId: this.loggedInUser.AdminGuid,
      NoteNo: "NA",
      ReceiverCharges: "0",
      ReceiverCity: "NA",
      CreditGuid: this.receivedFrom.Guid,
      ReceiverMobileNo: "0",
      ReceiverName: "NA",
      Remark: this.remark || "",
      SenderCharges: "0",
      SenderCity: "NA",
      DebitGuid: senderGuid,
      SenderMobileNo: "0",
      SenderName: "NA",
      Token: this.loggedInUser.Token,
      TranDate: moment(this.date).format('YYYY-MM-DD'),
      TranType: 'PROFIT'
    }
    if (this.tranType === 'loss') {
      params.CreditGuid = senderGuid;
      params.DebitGuid = this.receivedFrom.Guid;
      params.TranType = 'LOSS'
    }

    this.spinner.show();
    this.crudService.postByUrl('/ProfitAndLossTransaction', params).subscribe({
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
