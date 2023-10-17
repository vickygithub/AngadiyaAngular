import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-angadiya-list',
  templateUrl: './angadiya-list.component.html',
  styleUrls: ['./angadiya-list.component.scss']
})
export class AngadiyaListComponent {
  public loggedInUser: any;
  public transactions: any = [];
  public accountList: any = [];
  public searchText: any;
  public sendList: any = [];
  public receiveList: any = [];
  public filteredSendList: any = [];
  public filteredReceiveList: any = [];
  public searchGuid: any = null;
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
      TransactionType: 'angadiya'
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes('Invalid')) {
          this.commonService.emitSuccessErrorEventEmitter({ message: res, success: false });
          return;
        }
        this.transactions = [...res];
        this.transactions.forEach((t: any) => {
          if (t.TransitionType.toLowerCase() === 'send') {
            const account = this.accountList.find((a: any) => a.Guid === t.CreditGuid);
            if (account) {
              t.displayName = account.Name;
            }
          } else if (t.TransitionType.toLowerCase() === 'receive') {
            const account = this.accountList.find((a: any) => a.Guid === t.DebitGuid);
            if (account) {
              t.displayName = account.Name;
            }
          }

        })
        this.sendList = this.transactions.filter((t: any) => t.TransitionType.toLowerCase() === 'send');
        this.filteredSendList = [...this.sendList];

        this.filteredSendList = this.groupAndSortData(this.sendList);

        

        this.receiveList = this.transactions.filter((t: any) => t.TransitionType.toLowerCase() === 'receive');
        this.filteredReceiveList = [...this.receiveList];
      },
      error: (err) => {
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
    switch (row.TransitionType.toLowerCase()) {
      case "send":
        this.router.navigate(['/dashboard/angadiya'], { state: row });
        break;
      case "receive":
        this.router.navigate(['/dashboard/angadiya'], { state: row });
        break;
      default:
        break;
    }
  }
  filterList(type: string) {
    switch (type.toLowerCase()) {
      case 'send':
        if (this.searchGuid == null) {
          this.filteredSendList = this.groupAndSortData(this.sendList); 
        } else {
          this.filteredSendList = this.groupAndSortData(this.sendList).filter((s: any) => s.CreditGuid === this.searchGuid);
        }
        break;
      case 'receive':
        if (this.searchGuid == null) {
          this.filteredReceiveList = this.receiveList; 
        } else {
          this.filteredReceiveList = this.receiveList.filter((s: any) => s.DebitGuid === this.searchGuid);
        }
        break;
      default:
        break;
    }
  }
  ngOnInit() {
    this.fetchAccountList();
  }
}
