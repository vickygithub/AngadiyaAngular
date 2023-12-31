import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public userDetails: any = {
    mobile: "",
    password: ""
  };

  constructor(private crudService: CrudService, private router: Router, private spinner: NgxSpinnerService, private auth: AuthService, private commonService: CommonService) {
  }

  ngOnInit() {

    if (this.auth.isAuthenticated() && this.auth.isUserActivated()) {
      this.router.navigate(['/dashboard']);
    }
  }


  login() {
    this.spinner.show();
    this.crudService.postByUrl('/Login', {
      userId: String(this.userDetails.mobile),
      deviceId: "83e9568fa4df9fc1",
      // deviceId: "5c1e2fcc27ce7a8e",
      password: this.userDetails.password
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.includes("INVALID") || res.includes("MISSMATCH")) {
          this.commonService.emitSuccessErrorEventEmitter({message: res, success: false});
          return;
        }
        let user = res[0];
        user.Password = null;
        sessionStorage.setItem('userDetails', JSON.stringify(user));

        if (!this.auth.isUserActivated()) {
          this.router.navigate(['/changepassword']);
          return;
        }
        this.router.navigate(['/dashboard']);
        
      },
      error: (err) => { 
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error! Please try again.', success: false});
      }
    })
  }
}
