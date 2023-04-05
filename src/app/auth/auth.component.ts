import { Component, OnInit ,Input} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { SessionStorageService } from '../services/session-storage.service';
import { WebSocketService } from '../services/web-socket.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']

})

export class AuthComponent implements OnInit{
  @Input() isVisible : boolean = true;
  visibility = 'shown';

  sideNavOpened: boolean = true;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = 'side';

  ngOnChanges() {
   this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

	constructor(
    private media: MediaObserver,
    private sessionStorageService: SessionStorageService,
    private router:Router,
    private websock: WebSocketService
  ) { }

	ngOnInit() {
    this.websock.showDesktopNotification();

		this.media.asObservable().subscribe(() => {
        this.toggleView();
    });

    if (sessionStorage.getItem('userid') !== null) {
      this.router.navigate(['/auth/dashboard'], { queryParams: { id: sessionStorage.getItem('userid') } });
    } else {
      this.router.navigate(['/login']);
    }
	}
    getRouteAnimation(outlet) {

       return outlet.activatedRouteData.animation;
       //return outlet.isActivated ? outlet.activatedRoute : ''
    }

	toggleView() {
		if (this.media.isActive('gt-md')) {
            this.sideNavMode = 'side';
            this.sideNavOpened = true;
            this.matDrawerOpened = false;
            this.matDrawerShow = true;
        } else if(this.media.isActive('gt-xs')) {
            this.sideNavMode = 'side';
            this.sideNavOpened = false;
            this.matDrawerOpened = true;
            this.matDrawerShow = true;
        } else if (this.media.isActive('lt-sm')) {
            this.sideNavMode = 'over';
            this.sideNavOpened = false;
            this.matDrawerOpened = false;
            this.matDrawerShow = false;
        }
	}
}
