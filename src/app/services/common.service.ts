import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public citiesSubjectNotifier = new BehaviorSubject<any>([]);
  constructor(private _snackBar: MatSnackBar, private router: Router) { }

  notifyToCityCreatePage(data: any) {
    this.citiesSubjectNotifier.next(data);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "",{
      duration: 3000
    });
  }

  navigate(url: any) {
    this.router.navigate(url);
  }
}
