import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-loss-list',
  templateUrl: './loss-list.component.html',
  styleUrls: ['./loss-list.component.scss']
})
export class LossListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public filteredLossList: any = [];
  public searchGuid: any = null;
  public date: any = new Date();
  @Input() accountList: any = [];
  public totalBalance: any = 0;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  fetchTransactions() {
    this.spinner.show();
    this.crudService.postByUrl('/TransactionList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid,
      TransactionType: 'pnl',
      TransitionType: 'LOSS',
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Invalid')) {
          this.commonService.emitSuccessErrorEventEmitter({ message: res, success: false });
          return;
        }
        res.forEach((t: any) => {
          const account = this.accountList.find((a: any) => a.Guid === t.DebitGuid);
          if (account) {
            t.displayName = account.Name;
          }
        })
        this.transactions = [...res];
        this.filteredLossList = [...res];
        this.totalBalance = this.filteredLossList.reduce((acc: any, curr: any) => {
          return acc + parseFloat(curr.Amount);
        }, 0);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  
  goToComponent(row: any) {
    row.fromAngadiyaList = true;
    this.router.navigate(['/dashboard/hisaab'], { state: row });
  }
  filterList() {
    if (this.searchGuid == null) {
      this.filteredLossList = this.transactions; 
      this.totalBalance = this.filteredLossList.reduce((acc: any, curr: any) => {
        return acc + parseFloat(curr.Amount);
      }, 0);
    } else {
      this.filteredLossList = this.transactions.filter((s: any) => s.DebitGuid === this.searchGuid);
    }
    
  }
  
  ngOnInit() {
    this.fetchTransactions();
  }
}
