import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent {
  public accountType: any;
  public accounts: any = [];
  public loggedInUser: any;
  public displayedColumns: any = ['sno', 'name', 'receivable', 'payable'];
  public totalPayable: any;
  public totalReceivable: any;
  public displayedNetColumns: any = ['net', 'blankCell', 'blankCell', 'netamount'];
  public netTotal: any;
  constructor(private route: ActivatedRoute, private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService, private router: Router) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.accountType = params.get('type');
      this.fetchAccounts();
    });
  }

  fetchAccounts() {
    this.spinner.show();
    this.crudService.postByUrl('/AccountList', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        switch (this.accountType) {
          case "angadiya":
            this.accounts = res.filter((r: any) => r.Type.toLowerCase() === 'angadiya' && r.ClosingBalance != 0);
            break;
          case "client":
            this.accounts = res.filter((r: any) => r.Type.toLowerCase() === 'client' && r.ClosingBalance != 0);
            break;
          case "others":
            this.accounts = res.filter((r: any) => r.Type.toLowerCase() !== 'angadiya' && r.Type.toLowerCase() !== 'client' && r.ClosingBalance != 0);
            break;
        }
        this.accounts.forEach((a: any, index: any) => {
          a.sno = (index + 1);
        });
        this.totalPayable = this.accounts.reduce((acc: any, curr: any) => {
          return acc + parseFloat(curr.ClosingBalance < 0 ? curr.ClosingBalance : 0);
        }, 0);
        this.totalReceivable = this.accounts.reduce((acc: any, curr: any) => {
          return acc + parseFloat(curr.ClosingBalance > 0 ? curr.ClosingBalance : 0);
        }, 0);
        this.netTotal = (this.totalPayable || 0) + (this.totalReceivable || 0);

        if (this.netTotal > 0) {
          this.displayedNetColumns = [];
          this.displayedNetColumns.push('net');
          this.displayedNetColumns.push('blankCell');
          this.displayedNetColumns.push('netamount');
          this.displayedNetColumns.push('blankCell');
        }
        if (this.netTotal < 0) {
          this.displayedNetColumns = [];
          this.displayedNetColumns.push('net');
          this.displayedNetColumns.push('blankCell');
          this.displayedNetColumns.push('blankCell');
          this.displayedNetColumns.push('netamount');
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: "Error!", success: false });
      }
    })
  }
}
