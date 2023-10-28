import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-settling-transaction',
  templateUrl: './settling-transaction.component.html',
  styleUrls: ['./settling-transaction.component.scss']
})
export class SettlingTransactionComponent {
  public date = new Date();
  public amount: any;
  public commission: any;
  public options: any = [];
  public receivedFrom: any;
  public remark: any;
  public loggedInUser: any;
  public maxDate: any = new Date();
  @Input() existingSettlingDetails: any;
  @Input() tranType: any;
  public actionLabel: any = 'Save';
  public accountListSubjectNotifier = new Subject<any>();
  public accountListSubject: Subscription;
  public originalExistingData: any;
  public selectedAngadiya: any;
  constructor(private spinner: NgxSpinnerService, private router: Router, private crudService: CrudService, private commonService: CommonService) {
    this.accountListSubject = this.accountListSubjectNotifier.subscribe((res: any) => {
      if (this.existingSettlingDetails.Guid != null) {
        const angadiyas = this.options.filter((o: any) => o.Type.toLowerCase() === 'angadiya');
        if (this.existingSettlingDetails.TransitionType.toLowerCase() === 'sr') {
          this.receivedFrom = this.options.find((c: any) => c.Guid === this.existingSettlingDetails.CreditGuid);
          this.selectedAngadiya = angadiyas.find((c: any) => c.Guid === this.existingSettlingDetails.DebitGuid).Guid;
        } else { //sp
          this.receivedFrom = this.options.find((c: any) => c.Guid === this.existingSettlingDetails.DebitGuid);
          this.selectedAngadiya = angadiyas.find((c: any) => c.Guid === this.existingSettlingDetails.CreditGuid).Guid;
        }

        //store delete data 
        
        const deleteData = {
          date: moment(this.date).format('YYYY-MM-DD'),
          debitGuid: this.existingSettlingDetails.TransitionType.toLowerCase() === 'sr' ? this.selectedAngadiya : this.receivedFrom.Guid,
          creditGuid: this.existingSettlingDetails.TransitionType.toLowerCase() === 'sr' ? this.receivedFrom.Guid : this.selectedAngadiya
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
      TranGuid: this.existingSettlingDetails.Guid,
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
        const angadiyas = this.options.filter((o: any) => o.Type.toLowerCase() === 'angadiya');
        if (angadiyas && angadiyas.length > 0) {
          this.selectedAngadiya = angadiyas[0].Guid;
        }
        if (this.existingSettlingDetails.Guid != null) {
          this.date = this.commonService.getDatePickerDate(this.existingSettlingDetails.TranDate);
          this.amount = this.existingSettlingDetails.Amount;
          this.commission = this.existingSettlingDetails.COMMAMOUNT;
          this.remark = this.existingSettlingDetails.Remark;

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
    this.commission = null;
    this.receivedFrom = null;
    this.remark = null;
  }


  save(isUpdate: boolean = false) {
    if (this.date == null || this.amount == null || this.receivedFrom == null || this.selectedAngadiya == null) {
      this.commonService.emitSuccessErrorEventEmitter({ message: 'Enter all (*) fields', success: false });
      return;
    }
    if (this.amount < 0) {
      this.commonService.emitSuccessErrorEventEmitter({ message: 'Invalid Amount', success: false });
      return;
    }
    if (isUpdate) {
      this.deleteTran(isUpdate);
    } else {
      this.submitTran();
    }
    
  }

  submitTran() {
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
      DebitGuid: this.selectedAngadiya,
      SenderMobileNo: "0",
      SenderName: "NA",
      Token: this.loggedInUser.Token,
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }
    if (this.tranType === 'sp') {
      params.CreditGuid = this.selectedAngadiya;
      params.DebitGuid = this.receivedFrom.Guid;
    }

    this.spinner.show();
    this.crudService.postByUrl(`${this.tranType === 'sr' ? '/SettlingReceiptTransaction' : '/SettlingPaymentTransaction'}`, params).subscribe({
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
