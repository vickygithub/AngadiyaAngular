import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-cash-transaction-list',
  templateUrl: './cash-transaction-list.component.html',
  styleUrls: ['./cash-transaction-list.component.scss']
})
export class CashTransactionListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public accountList: any = [];
  public searchText: any;
  public paymentList: any = [];
  public receiptLust: any = [];
  public filteredPaymentList: any = [];
  public filteredReceiptList: any = [];
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
  fetchAccountList() {
    this.spinner.show();
    const user = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.crudService.postByUrl('/AccountList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: user.Token,
      LoginId: user.Guid
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.accountList = res;

        this.fetchTransactions();
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: "Error!", success: false });
      }
    })
  }
  fetchTransactions() {
    this.spinner.show();
    this.crudService.postByUrl('/TransactionList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid,
      TransactionType: 'cash'
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Invalid')) {
          this.commonService.emitSuccessErrorEventEmitter({ message: res, success: false });
          return;
        }
        this.transactions = [...res];
        this.transactions.forEach((t: any) => {
          if (t.TransitionType.toLowerCase() === 'cr') {
            const account = this.accountList.find((a: any) => a.Guid === t.CreditGuid);
            if (account) {
              t.displayName = account.Name;
            }
          } else if (t.TransitionType.toLowerCase() === 'cp') {
            const account = this.accountList.find((a: any) => a.Guid === t.DebitGuid);
            if (account) {
              t.displayName = account.Name;
            }
          }

        })
        this.paymentList = this.transactions.filter((t: any) => t.TransitionType.toLowerCase() === 'cp');
        this.filteredPaymentList = [...this.paymentList];
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
  filterList(type: string) {
    switch (type.toLowerCase()) {
      case 'cp':
        this.filteredPaymentList = this.paymentList.filter((s: any) => s.displayName.includes(this.searchText));
        break;
      case 'cr':
        this.filteredReceiptList = this.receiptLust.filter((s: any) => s.displayName.includes(this.searchText));
        break;
      default:
        break;
    }
  }
  ngOnInit() {
    this.fetchAccountList();
  }
}
