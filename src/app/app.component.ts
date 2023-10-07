import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { UpdateService } from './services/update.service';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angadiya';
  private numberOfSeconds: number = 60;
  constructor(private _idle: Idle, private router: Router, private sw: UpdateService, private commonService: CommonService) {
    this.commonService.getNewAppVersionAvailableEventEmitter().subscribe(() => this.sw.promptUser());
  }
  
  ngOnInit() {
    
    this._idle.setIdle(this.numberOfSeconds);
    this._idle.setTimeout(this.numberOfSeconds);
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this._idle.onTimeout.subscribe(() => {
      // Hide the modal, log out, do something else
      this.router.navigate(['/login']);
      sessionStorage.clear();
    });

    this._idle.watch()
  }
}
