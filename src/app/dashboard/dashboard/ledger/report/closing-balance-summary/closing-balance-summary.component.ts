import { Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';

@Component({
  selector: 'app-closing-balance-summary',
  templateUrl: './closing-balance-summary.component.html',
  styleUrls: ['./closing-balance-summary.component.scss']
})
export class ClosingBalanceSummaryComponent {
  public loggedInUser: any;
  public balanceList: any = [];
  @Input() selectedAcount: any;
  constructor(private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  ngOnInit() {
    const params = {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      AdminGuid: this.loggedInUser.AdminGuid,
      AccountGuid: this.selectedAcount.Guid
    }
    this.spinner.show();
    this.crudService.postByUrl('/ClosingBalanceSummary', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.balanceList = res;
        this.balanceList.map((b: any) => b.actualDate = moment(this.commonService.getDatePickerDate(b.Date)))
        this.balanceList.sort((a: any, b: any) => a.actualDate.unix() - b.actualDate.unix()) 
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.openSnackBar("Error!!!");
      }
    })
  }
}
