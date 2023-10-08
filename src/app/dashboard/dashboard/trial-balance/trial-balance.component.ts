import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent {
  public filteredReceivable: any;
  public filteredPayable: any;
  public accountList: any;
  public balanceMatched: any = false;
  public totalReceivable: any;
  public totalPayable: any;
  constructor(private router: Router, private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService) { }

  back() {
    this.router.navigate(['/dashboard/main']);
  }
  goToLedger(account: any) {
    this.router.navigate(['/dashboard/ledger/report'], {state: account});
  }
  ngOnInit() {
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
        this.filteredReceivable = res.filter((r: any) => r.ClosingBalance > 0);
        this.filteredPayable = res.filter((r: any) => r.ClosingBalance < 0);

        this.totalReceivable = this.filteredReceivable.reduce((acc: any, curr: any) => {
          return acc + parseFloat(curr.ClosingBalance);
        }, 0);
        this.totalPayable = this.filteredPayable.reduce((acc: any, curr: any) => {
          return acc + parseFloat(curr.ClosingBalance);
        }, 0);

        this.balanceMatched = Math.abs(this.totalPayable) === Math.abs(this.totalReceivable); 
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
}
