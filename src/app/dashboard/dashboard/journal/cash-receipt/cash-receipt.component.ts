import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cash-receipt',
  templateUrl: './cash-receipt.component.html',
  styleUrls: ['./cash-receipt.component.scss']
})
export class CashReceiptComponent {

  public date = new Date();
  public amount: any;
  public commission: any;
  public options: any = [];
  public receivedFrom: any;
  public remark: any;
  public loggedInUser: any;
  public maxDate: any = new Date();
  @Input() existingCrDetails: any;
  @Input() tranType: any;

  public accountListSubjectNotifier = new Subject<any>();
  public accountListSubject: Subscription;
  constructor(private spinner: NgxSpinnerService, private router: Router, private crudService: CrudService, private commonService: CommonService) {
    this.accountListSubject = this.accountListSubjectNotifier.subscribe((res: any) => {
      if (this.existingCrDetails.Guid != null) {
        if (this.existingCrDetails.TransitionType.toLowerCase() === 'cr') {
          this.receivedFrom = this.options.find((c: any) => c.Guid === this.existingCrDetails.CreditGuid);
        } else { //cp
          this.receivedFrom = this.options.find((c: any) => c.Guid === this.existingCrDetails.DebitGuid);
        }
      }
    });
  }
  ngOnDestory() {
    this.accountListSubjectNotifier.unsubscribe();
  }
  displayFn(event: any) {
    return event && event.Name ? event.Name : '';
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
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
  
  ngOnInit() {
    this.fetchAccountList();
    if (this.existingCrDetails.Guid != null) {
      this.date = this.commonService.getDatePickerDate(this.existingCrDetails.TranDate);
      this.amount = this.existingCrDetails.Amount;
      this.commission = this.existingCrDetails.COMMAMOUNT;
      this.remark = this.existingCrDetails.Remark;
    }
  }
  reset() {
    this.date = new Date();
    this.amount = null;
    this.commission = null;
    this.receivedFrom = null;
    this.remark = null;
  }
  

  save() {
    if (this.date == null || this.amount == null || this.receivedFrom == null) {
      return;
    }
    if (this.amount < 0) {
      return;
    }
    const senderGuid = this.options.find((o: any) => o.Type.toLowerCase() === "cash").Guid;
    let params = {
      AdminGuid: this.loggedInUser.AdminGuid,
      Amount: "" + this.amount.toFixed(2),
      Commission: "" + (this.commission || 0).toFixed(2),
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
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }
    if (this.tranType === 'cp') {
      params.CreditGuid = senderGuid;
      params.DebitGuid = this.receivedFrom.Guid;
    }
    
    this.spinner.show();
    this.crudService.postByUrl(`${this.tranType === 'cr' ? '/ReceiptTransaction' : '/CashPaymentTransaction'}`, params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
}
