import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss']
})
export class JournalListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public accountList: any = [];
  public searchText: any;
  public filteredTranList: any = [];
  public date: any = new Date();

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
      TransactionType: 'jr',
      TransitionType: 'JR',
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Invalid')) {
          this.commonService.emitSuccessErrorEventEmitter({ message: res, success: false });
          return;
        }
        this.transactions = [...res];
        this.transactions.forEach((t: any) => {
          const creditAccount = this.accountList.find((a: any) => a.Guid === t.CreditGuid);
          const debitAccount = this.accountList.find((a: any) => a.Guid === t.DebitGuid);
            if (debitAccount && creditAccount) {
              t.debitName = debitAccount.Name;
              t.creditName = creditAccount.Name;
            }
        })
        this.filteredTranList = [...this.transactions];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  goToComponent(row: any) {
    this.router.navigate(['/dashboard/journaltransaction'], { state: row });
  }
  filterList() {
    this.filteredTranList = this.transactions.filter((s: any) => s.debitName.includes(this.searchText) || s.creditName.includes(this.searchText));
  }
  ngOnInit() {
    this.fetchAccountList();
  }
}
