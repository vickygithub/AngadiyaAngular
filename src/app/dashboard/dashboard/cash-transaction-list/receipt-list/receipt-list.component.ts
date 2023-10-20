import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public searchText: any;
  public receiptLust: any = [];
  public filteredReceiptList: any = [];
  @Input() accountList: any = [];
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  
  
  fetchTransactions() {
    this.spinner.show();
    this.crudService.postByUrl('/TransactionList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid,
      TransactionType: 'cash',
      TransitionType: 'CR',
      TranDate: moment(new Date()).format('YYYY-MM-DD')
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Invalid')) {
          this.commonService.emitSuccessErrorEventEmitter({ message: res, success: false });
          return;
        }
        this.transactions = [...res];
        this.transactions.forEach((t: any) => {
          const account = this.accountList.find((a: any) => a.Guid === t.CreditGuid);
          if (account) {
            t.displayName = account.Name;
          }
         
        })
       
        this.receiptLust = this.transactions.filter((t: any) => t.TransitionType.toLowerCase() === 'cr');
        this.filteredReceiptList = [...this.receiptLust];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  goToComponent(row: any) {
    this.router.navigate(['/dashboard/cashtransaction'], { state: row });
  }
  filterList() {
    this.filteredReceiptList = this.receiptLust.filter((s: any) => s.displayName.includes(this.searchText));
  }
  ngOnInit() {
    this.fetchTransactions();
  }
}
