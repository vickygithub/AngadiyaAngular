import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent {
  public filteredAccounts: any = [];
  public accounts: any = [];
  public loggedInUser: any;
  public searchText: any;
  public totalClosingBalance: any = 0;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) { 
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  filterList() {
    if (this.searchText == null || this.searchText == "") {
      this.filteredAccounts = this.accounts;
      return;
    }
    this.filteredAccounts = this.accounts.filter((a: any) => a.Name.toLowerCase().includes(this.searchText));
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
  openReport(account: any) {
    this.router.navigate(['/dashboard/ledger/report'], {state: account});
  }
  ngOnInit() {
    this.spinner.show();
    this.crudService.postByUrl('/AccountList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid
    }).subscribe({
      next: (res: any) => {
        if (typeof res === 'string' && res.toLowerCase().includes('')) {
          this.commonService.emitSuccessErrorEventEmitter({message: res, success: false});
          return;
        }
        this.totalClosingBalance = res.reduce((acc: any, curr: any) => {
          return acc + curr.ClosingBalance;
        }, 0)
        res.forEach((r: any) => {

        })
        res.sort((a: any, b: any) => {
          // Use the localeCompare method to perform a case-insensitive string comparison
          return a.Name.localeCompare(b.Name);
        });
        this.spinner.hide();
        this.accounts = [...res];
        this.filteredAccounts = [...res];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
}
