import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _snackBar: MatSnackBar, private router: Router) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, "",{
      duration: 3000
    });
  }

  navigate(url: any) {
    this.router.navigate(url);
  }
}
