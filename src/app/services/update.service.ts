import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, first, interval } from 'rxjs';
import { CommonService } from './common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate, private commonService: CommonService, private snackbar: MatSnackBar, private appRef: ApplicationRef) {
    this.checkUpdates();
    swUpdate.unrecoverable.subscribe(event => {
      confirm(
        'An error occurred that we cannot recover from:\n' +
        event.reason +
        '\n\nPlease reload the page.'
      );
    });
  }
  private checkUpdates() {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everyMinute$ = interval(1 * 60 * 1000);
    const everyMinuteOnceAppIsStable$ = concat(appIsStable$, everyMinute$);

    everyMinuteOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
        if (updateFound) {
          this.informUser();
          if (confirm("Update Available, Press OK!")) {
            window.location.reload();
          }
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
  public informUser(): void {
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        console.log("Update available");
        this.commonService.emitNewAppVersionAvailableEventEmitter();
      });
  }
  public promptUser(): void {
    const snack = this.snackbar.open('Update Available', 'Reload');
    snack
      .onAction()
      .subscribe(() => {
        window.location.reload();
      });

  }
}
