import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';

@Component({
  selector: 'app-received-list',
  templateUrl: './received-list.component.html',
  styleUrls: ['./received-list.component.scss']
})
export class ReceivedListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public filteredReceiveList: any = [];
  public searchGuid: any = null;
  public totalBalance: any = 0;
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
      TransactionType: 'angadiya',
      TransitionType: 'RECEIVE',
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
        this.filteredReceiveList = [...res];
      },
      error: (err: any) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  
  goToComponent(row: any) {
    row.fromAngadiyaList = true;
    this.router.navigate(['/dashboard/angadiya'], { state: row });
  }
  filterList() {
    if (this.searchGuid == null) {
      this.filteredReceiveList = this.transactions; 
     
    } else {
      this.filteredReceiveList = this.transactions.filter((s: any) => s.DebitGuid === this.searchGuid);
      this.totalBalance = this.filteredReceiveList.reduce((acc: any, curr: any) => {
        return acc + parseFloat(curr.Amount);
      }, 0);
    }
    
  }
  
  ngOnInit() {
    this.fetchTransactions();
  }
}
