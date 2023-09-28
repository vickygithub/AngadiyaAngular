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
  public client: any = [];
  public others: any = [];
  constructor(private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService, private router: Router) {

  }

  editAccount(account: any) {
    console.log(account)
    this.router.navigate([`/dashboard/account/edit`], {state: account});
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
  ngOnInit() {
    this.spinner.show();
    const user = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.crudService.postByUrl('/AccountList', {
      DeviceId: "5c1e2fcc27ce7a8e",
      Token: user.Token,
      LoginId: user.Guid
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        console.log("res", res);
        this.angadiya = res.filter((r: any) => r.Type.toLowerCase() === 'angadiya');
        this.client = res.filter((r: any) => r.Type.toLowerCase() === 'client');
        this.others = res.filter((r: any) => r.Type.toLowerCase() !== 'angadiya' && r.Type.toLowerCase() !== 'client');
      },
      error: (err) => {
        console.log("err");
        this.spinner.hide();
      }
    })
  }
}
