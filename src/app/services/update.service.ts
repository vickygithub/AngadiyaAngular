import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    if (swUpdate.isEnabled) {
      interval(1 * 60 * 1000).subscribe(() => swUpdate.checkForUpdate()
        .then(() => this.informUser()));
    }

  }
  public informUser(): void {
    this.swUpdate.available.subscribe(event => this.promptUser());
  }
  private promptUser(): void {
    const snack = this.snackbar.open('Update Available', 'Reload');
    snack
      .onAction()
      .subscribe(() => {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      });

  }
}
