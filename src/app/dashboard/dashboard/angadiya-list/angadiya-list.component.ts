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
  public totalBalance: any = 0;
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
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: "Error!", success: false });
      }
    })
  }
  
  
  tabChange(event: any) {
    this.searchGuid = null;
    // this.filteredSendList = this.groupAndSortData(this.sendList); 
    // this.filteredReceiveList = this.receiveList;
  }
  ngOnInit() {
    this.fetchAccountList();
  }
}
