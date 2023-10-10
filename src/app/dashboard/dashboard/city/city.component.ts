import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent {
  public cities: any = [];
  public filteredCities: any = [];
  public loggedInUser: any;
  public searchText: any;
  constructor(private router: Router, private crudService: CrudService, private spinner: NgxSpinnerService, private commonService: CommonService) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  filterCities() {
    this.filteredCities = this.cities.filter((c: any) => c.Name.toLowerCase().includes(this.searchText));
  }
  ngOnInit() {
    const params = {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid
    }
    this.spinner.show();
    this.crudService.postByUrl('/CityList', params).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        
        this.cities = res;
        this.cities.forEach((c: any) =>{
          c.Name = c.Name.charAt(0).toUpperCase() + c.Name.slice(1);
        })
        this.cities.sort((a: any, b: any) => {
          // Use the localeCompare method to perform a case-insensitive string comparison
          return a.Name.localeCompare(b.Name);
        });
        this.filteredCities = [...this.cities];
      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({message: 'Error!', success: false});
      }
    })
  }

  back() {
    this.router.navigate(['/dashboard/main']);
  }
  add() {
    this.commonService.notifyToCityCreatePage(this.cities);
    this.router.navigate(['/dashboard/city/add'])
  }
}
