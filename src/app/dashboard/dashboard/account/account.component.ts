import { Component } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  public angadiya: any = [];
  public filteredAngadiya: any = [];
  public client: any = [];
  public filteredClient: any = [];
  public others: any = [];
  public filteredOthers: any = [];
  public searchText: any;
  constructor(private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService, private router: Router) {

  }

  editAccount(account: any) {
    if (account.Type.toLowerCase().replace(/\s/g, '') === 'capital' || account.Name.toLowerCase().replace(/\s/g, '') === 'capitalaccount') {
      return;
    }
    this.router.navigate([`/dashboard/account/edit`], { state: account });
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
  add() {
    this.router.navigate(['/dashboard/account/create']);
  }
  filterList(tab: number) {
    switch (tab) {
      case 1:
        this.filteredAngadiya = this.angadiya.filter((a: any) => a.Name.toLowerCase().includes(this.searchText));
        break;
      case 2:
        this.filteredClient = this.client.filter((a: any) => a.Name.toLowerCase().includes(this.searchText));
        break;
      case 3:
        this.filteredOthers = this.others.filter((a: any) => a.Name.toLowerCase().includes(this.searchText));
        break;
      default:
        break;
    }
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
        this.angadiya = res.filter((r: any) => r.Type.toLowerCase() === 'angadiya');
        this.client = res.filter((r: any) => r.Type.toLowerCase() === 'client');
        this.others = res.filter((r: any) => r.Type.toLowerCase() !== 'angadiya' && r.Type.toLowerCase() !== 'client');

        this.filteredAngadiya = [...this.angadiya];
        this.filteredClient = [...this.client];
        this.filteredOthers = [...this.others];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: "Error!", success: false});
      }
    })
  }
}
