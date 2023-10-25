import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-profit-list',
  templateUrl: './profit-list.component.html',
  styleUrls: ['./profit-list.component.scss']
})
export class ProfitListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public filteredProfitList: any = [];
  public searchGuid: any = null;
  public date: any = new Date();
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
      TransactionType: 'pnl',
      TransitionType: 'PROFIT',
      TranDate: moment(this.date).format('YYYY-MM-DD')
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Invalid')) {
          this.commonService.emitSuccessErrorEventEmitter({ message: res, success: false });
          return;
        }
        res.forEach((t: any) => {
          const account = this.accountList.find((a: any) => a.Guid === t.CreditGuid);
          if (account) {
            t.displayName = account.Name;
          }
        })
        this.transactions = [...res];
        this.filteredProfitList = [...res];
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
      this.filteredProfitList = this.transactions; 
     
    } else {
      this.filteredProfitList = this.transactions.filter((s: any) => s.CreditGuid === this.searchGuid);
    }
    
  }
  
  ngOnInit() {
    this.fetchTransactions();
  }
}
