import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sent-list',
  templateUrl: './sent-list.component.html',
  styleUrls: ['./sent-list.component.scss']
})
export class SentListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public filteredSendList: any = [];
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
      TransitionType: 'SEND',
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
              t.selfName = account.SelfName;
            }
        })
        this.transactions = [...res];
        this.filteredSendList = [...res];
        
        this.filteredSendList = this.groupAndSortData(this.transactions);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    })
  }
  groupAndSortData(data: any) {
    // Step 1: Group the data by CreditGuid
    const groupedData = data.reduce((acc: any, current: any) => {
      const key = current.CreditGuid;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(current);
      return acc;
    }, {});

    // Step 2: Sort the grouped data by SendTokenNo
    const sortedData = Object.values(groupedData).map((group: any) =>
      group.sort((a: any, b: any) => a.SendTokenNo - b.SendTokenNo)
    );

    // Step 3: Flatten the sorted data back to an array
    return sortedData.flat();
  }
  goToComponent(row: any) {
    row.fromAngadiyaList = true;
    this.router.navigate(['/dashboard/angadiya'], { state: row });
  }
  filterList() {
    if (this.searchGuid == null) {
      this.filteredSendList = this.groupAndSortData(this.transactions); 
      
    } else {

      this.filteredSendList = this.groupAndSortData(this.transactions).filter((s: any) => s.CreditGuid === this.searchGuid);
      this.totalBalance = this.filteredSendList.reduce((acc: any, curr: any) => {
        return acc + parseFloat(curr.Amount);
      }, 0);
    }
  }
  
  ngOnInit() {
    this.fetchTransactions();
  }
}
