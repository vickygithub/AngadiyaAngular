import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate, private commonService: CommonService) {
    interval(1 * 60 * 1000).subscribe(() => swUpdate.checkForUpdate()
      .then(() => this.informUser()));

  }
  public informUser(): void {
    this.swUpdate.versionUpdates.subscribe(event => this.commonService.emitNewAppVersionAvailableEventEmitter());
  }
  
}
