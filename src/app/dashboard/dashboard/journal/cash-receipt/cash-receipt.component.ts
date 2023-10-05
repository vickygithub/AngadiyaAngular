import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';

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
  public filteredOptions: any = [];
  public receivedFrom: any;
  public remark: any;
  public loggedInUser: any;
  constructor(private spinner: NgxSpinnerService, private router: Router, private crudService: CrudService, private commonService: CommonService) {

  }

  displayFn(event: any) {
    console.log(event)
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
        console.log("res", res);
        this.options = res;
      },
      error: (err) => {
        console.log("err");
        this.spinner.hide();
      }
    })
  }
  doFilter() {
    console.log(this.receivedFrom);
    this.filteredOptions = this.options.filter((o: any) => o.Name.toLowerCase().includes(typeof this.receivedFrom === 'string' ? this.receivedFrom.toLowerCase() : this.receivedFrom) && o.Type.toLowerCase() !== "cash");
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
  

  save() {
    if (this.date == null || this.amount == null || this.receivedFrom == null) {
      return;
    }
    if (this.amount < 0) {
      return;
    }
    const senderGuid = this.options.find((o: any) => o.Type.toLowerCase() === "cash").Guid;
    const params = {
      AdminGuid: this.loggedInUser.AdminGuid,
      Amount: "" + this.amount.toFixed(2),
      Commission: "" + (this.commission || 0).toFixed(2),
      DeviceId: "83e9568fa4df9fc1",
      LoginId: this.loggedInUser.AdminGuid,
      NoteNo: "NA",
      ReceiverCharges: "0",
      ReceiverCity: "NA",
      ReceiverGuid: this.receivedFrom.Guid,
      ReceiverMobileNo: "0",
      ReceiverName: "NA",
      Remark: this.remark || "",
      SenderCharges: "0",
      SenderCity: "NA",
      SenderGuid: senderGuid,
      SenderMobileNo: "0",
      SenderName: "NA",
      Token: this.loggedInUser.Token,
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }
    console.log("params", params);
    return
    this.spinner.show();
    this.crudService.postByUrl('/ReceiptTransaction', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        console.log("res", res);
        this.commonService.openSnackBar(res);
        this.reset();
      },
      error: (err) => {
        this.spinner.hide();
        console.log("err");
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
}
