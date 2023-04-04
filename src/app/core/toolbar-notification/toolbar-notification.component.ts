import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'cdk-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: ['./toolbar-notification.component.scss']
})
export class ToolbarNotificationComponent implements OnInit {
	cssPrefix = 'toolbar-notification';
  isOpen: boolean = false;
  @Input() notifications = [];

  private division = this.sessionStorageService.getSession('division');
  private role = this.sessionStorageService.getSession('access');

    /*@HostListener('document:click', ['$event', '$event.target'])
      onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (!targetElement) {
          return;
        }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          this.isOpen = false;
        }
      }*/

  	constructor(private elementRef: ElementRef, public notif: NotificationsService, private sessionStorageService: SessionStorageService) { }

  	ngOnInit() {
      this.notif.viewNotifications(this.division, this.role)
      .subscribe(data => {
        let result:any = data;
        this.notif.notificationContent = result;
      });
  	}

  	select() {

  	}

  	delete(notification) {

  	}

}
