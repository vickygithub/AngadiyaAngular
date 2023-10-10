import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent {
  public cityName: any;
  public loggedInUser: any;
  private citiesSubscription: Subscription;
  private existingCities: any = [];
  constructor(private router: Router, private commonService: CommonService, private spinner: NgxSpinnerService, private crudService: CrudService){
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
    this.citiesSubscription = this.commonService.citiesSubjectNotifier.subscribe((data) => {
      this.existingCities = data;
    })
  }
  ngOnDestroy() {
    this.citiesSubscription.unsubscribe();
  }
  ngOnInit() {
   if (this.existingCities.length === 0) {
    const params = {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid
    }
    this.spinner.show();
    this.crudService.postByUrl('/CityList', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.existingCities = [...res];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
   }
  }
  back() {
    this.router.navigate(['/dashboard/city']);
  }
  add() {
    const existingCityFound = this.existingCities && this.existingCities.find((c: any) => c.Name.toLowerCase() === this.cityName.toLowerCase());
    if (existingCityFound) {
      this.commonService.emitSuccessErrorEventEmitter({success: false, message: 'City Already Exist!'});
      return;
    }
    this.spinner.show();
    this.crudService.postByUrl('/CityCreate', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid,
      Name: this.cityName.charAt(0).toUpperCase() + this.cityName.slice(1)
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({success: true});
        this.router.navigate(['/dashboard/city']);
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }
}
