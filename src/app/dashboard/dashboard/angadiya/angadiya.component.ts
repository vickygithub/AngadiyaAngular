import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-angadiya',
  templateUrl: './angadiya.component.html',
  styleUrls: ['./angadiya.component.scss']
})
export class AngadiyaComponent {
  constructor(private router: Router){}
  back() {
    this.router.navigate(['/dashboard/main']);
  }
}
