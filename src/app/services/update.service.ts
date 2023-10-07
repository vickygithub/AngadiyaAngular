import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar, private commonService: CommonService) {
    interval(1 * 60 * 1000).subscribe(() => swUpdate.checkForUpdate()
      .then(() => this.informUser()));

  }
  public informUser(): void {
    this.swUpdate.available.subscribe(event => this.commonService.emitNewAppVersionAvailableEventEmitter());
  }
  public promptUser(): void {
    const snack = this.snackbar.open('Update Available', 'Reload');
    snack
      .onAction()
      .subscribe(() => {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      });

  }
}
