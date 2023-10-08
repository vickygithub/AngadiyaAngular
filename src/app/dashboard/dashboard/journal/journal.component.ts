import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';


@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent {
  public selectedIndex: any = 0;
  public existingCrDetails: any;
  constructor(private router: Router, private crudService: CrudService) {

  }
  ngOnInit() {
    this.existingCrDetails = history.state;
    if (this.existingCrDetails.Guid != null) {
      if (this.existingCrDetails.TransitionType.toLowerCase() === 'cr') {
        this.selectedIndex = 1;
      }
    }
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
}
