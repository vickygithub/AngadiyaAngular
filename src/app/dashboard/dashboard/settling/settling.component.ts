import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settling',
  templateUrl: './settling.component.html',
  styleUrls: ['./settling.component.scss']
})
export class SettlingComponent {
  public selectedIndex: any = 0;
  public existingSettlingDetails: any;
  constructor(private router: Router) {

  }
  ngOnInit() {
    this.existingSettlingDetails = history.state;
    if (this.existingSettlingDetails.Guid != null) {
      if (this.existingSettlingDetails.TransitionType.toLowerCase() === 'sp') {
        this.selectedIndex = 0;
      }
      if (this.existingSettlingDetails.TransitionType.toLowerCase() === 'sr') {
        this.selectedIndex = 1;
      }
    }
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
}
