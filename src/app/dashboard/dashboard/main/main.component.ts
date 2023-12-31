import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

enum UserRoleEnum {
  superAdmin = 'SUPERADMIN',
  admin = 'ADMIN'
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public loggedInUser: any;
  public breadcrumbs: any = [];
  public filteredMenus: any = [];
  public filteredUsers: any = [];
  public users: any = [];
  public searchText: any = '';
  constructor(private crudService: CrudService, private router: Router, private spinner: NgxSpinnerService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.breadcrumbs.push({Label: 'Main', Id: -1});
  }
  filterList() {
    this.filteredUsers = this.users.filter((s: any) => s.MobileNo.includes(this.searchText));
  }
  fetchMenus(parent: any = -1) {
    this.spinner.show();
    this.crudService.postByUrl('/UserMenuList', {
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1",
      ProjectTypeId: this.loggedInUser.ProjectType,
      Parent: parent
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res == null || (typeof res === 'string' && res.toLowerCase().includes("invalid"))) {
          this.commonService.emitSuccessErrorEventEmitter({message: 'Please refresh the page', success: false});
        }
        res.forEach((r: any) => {
          r.Icons = r.Icon.split(",");
        })
        
        this.filteredMenus = res.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
  navigateBread(index: any, menu: any) {
    if (index != this.breadcrumbs.length - 1) {
      this.breadcrumbs = this.breadcrumbs.slice(index, this.breadcrumbs.length - 1);
      this.fetchMenus(menu.Id)
    }
  }
  navigate(menu: any) {
    if (menu.Type === 'menu') {
      this.fetchMenus(menu.Id);
      this.breadcrumbs.push({Label: menu.Label, Id: menu.Id});
      return;
    }
    this.router.navigate([`/dashboard/${menu.Route}`]);
  }

  ngOnInit() {
    if (this.loggedInUser.ProjectType !== 1) {
        this.fetchMenus();
        return;
    }
    this.fetchMenus();
    if (this.loggedInUser.ProjectType === 1) {
      this.fetchAdmins();
    }
  }

  fetchAdmins() {
    this.spinner.show();
    this.crudService.postByUrl('/AdminList', {
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1",
      LoginId: this.loggedInUser.Guid
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res == null || (typeof res === 'string' && res.toLowerCase().includes("invalid"))) {
          this.commonService.emitSuccessErrorEventEmitter({message: 'Please refresh the page', success: false});
        }
        this.users = [...res];
        this.filteredUsers = [...res];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
  reposting(admin: any) {
    this.spinner.show();
    this.crudService.postByUrl('/RepostingAllData', {
      Token: this.loggedInUser.Token,
      DeviceId: "83e9568fa4df9fc1",
      AdminGuid: admin.Guid,
      AccountStartDate: moment(this.commonService.getDatePickerDate(admin.AccountStartDate)).format('YYYY-MM-DD')
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res == null || (typeof res === 'string' && res.toLowerCase().includes("invalid"))) {
          this.commonService.emitSuccessErrorEventEmitter({message: 'Please refresh the page', success: false});
        }
        this.commonService.emitSuccessErrorEventEmitter({success: true});
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
}
