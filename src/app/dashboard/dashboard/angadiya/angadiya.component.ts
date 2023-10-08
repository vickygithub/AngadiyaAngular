import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-angadiya',
  templateUrl: './angadiya.component.html',
  styleUrls: ['./angadiya.component.scss']
})
export class AngadiyaComponent {
  public existingSendDetails: any;
  public selectedIndex: any = 0;
  constructor(private router: Router){}

  ngOnInit() {
    this.existingSendDetails = history.state;
    if (this.existingSendDetails.Guid != null) {
      if (this.existingSendDetails.TransitionType.toLowerCase() === 'send') {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex = 1;
      }
    }
    
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
}
