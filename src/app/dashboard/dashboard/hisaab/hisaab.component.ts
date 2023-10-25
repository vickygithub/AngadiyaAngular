import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hisaab',
  templateUrl: './hisaab.component.html',
  styleUrls: ['./hisaab.component.scss']
})
export class HisaabComponent {
  public selectedIndex: any = 0;
  public existingHisaabDetails: any;
  constructor(private router: Router) {

  }
  ngOnInit() {
    this.existingHisaabDetails = history.state;
    if (this.existingHisaabDetails.Guid != null) {
      if (this.existingHisaabDetails.TransitionType.toLowerCase() === 'loss') {
        this.selectedIndex = 0;
      }
      if (this.existingHisaabDetails.TransitionType.toLowerCase() === 'profit') {
        this.selectedIndex = 1;
      }
    }
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }

}
