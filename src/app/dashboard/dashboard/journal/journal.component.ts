import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';


@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent {
  constructor(private router: Router, private crudService: CrudService) {

  }
 
  back() {
    this.router.navigate(['/dashboard/main']);
  }
}
