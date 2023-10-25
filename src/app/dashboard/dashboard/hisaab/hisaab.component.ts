import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hisaab',
  templateUrl: './hisaab.component.html',
  styleUrls: ['./hisaab.component.scss']
})
export class HisaabComponent {
  public selectedIndex: any = 0;
  public existingCrDetails: any;
  constructor(private router: Router) {

  }
  ngOnInit() {
    this.existingCrDetails = history.state;
    if (this.existingCrDetails.Guid != null) {
      if (this.existingCrDetails.TransitionType.toLowerCase() === 'loss') {
        this.selectedIndex = 0;
      }
      if (this.existingCrDetails.TransitionType.toLowerCase() === 'profit') {
        this.selectedIndex = 1;
      }
    }
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }

}
