import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public citiesSubjectNotifier = new BehaviorSubject<any>([]);
  @Output() newAppVersionAvailableEventEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private _snackBar: MatSnackBar, private router: Router) { }

  public getDatePickerDate(date: any) {
    const parts = date.split("-");
    const dateArray = [parts[1], parts[0], parts[2]];
    const dateString = dateArray.join("-");
    return new Date(dateString);
  }

  public getNewAppVersionAvailableEventEmitter() {
    return this.newAppVersionAvailableEventEmitter;
  }

  public emitNewAppVersionAvailableEventEmitter() {
    this.newAppVersionAvailableEventEmitter.emit();
  }
  notifyToCityCreatePage(data: any) {
    this.citiesSubjectNotifier.next(data);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 3000
    });
  }

  navigate(url: any) {
    this.router.navigate(url);
  }

  isMobileValid(input: any) {
    if (String(input).startsWith("0")) {
      return false;
    }
    if ((/^\d{10}$/.test(input))) {
      return true;
    }
    return false;
  }
}
