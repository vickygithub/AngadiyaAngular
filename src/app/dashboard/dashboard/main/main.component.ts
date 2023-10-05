import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
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
  public menus: any = [];

  constructor(private crudService: CrudService, private router: Router, private spinner: NgxSpinnerService) {
  }

  fetchMenus() {
    this.spinner.show();
    this.crudService.postByUrl('/UserMenuList', {
      Token: this.loggedInUser.Token,
      DeviceId: "5c1e2fcc27ce7a8e",
      ProjectTypeId: this.loggedInUser.ProjectType
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        res.forEach((r: any) => {
          r.Icons = r.Icon.split(",");
        })
        this.menus = res.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
      },
      error: (err) => {
        this.spinner.hide();
      }
    })
  }

  navigate(menu: any) {
    this.router.navigate([`/dashboard/${menu.Route}`]);
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);

    this.fetchMenus();
  }
}
