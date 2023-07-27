import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { Router, NavigationExtras } from '@angular/router';
import { PrService } from '../../services/pr.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemsViewComponent } from '../../pages/items-view/items-view.component';

@Component({
  selector: 'cdk-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: ['./toolbar-notification.component.scss']
})
export class ToolbarNotificationComponent implements OnInit {
	cssPrefix = 'toolbar-notification';
  isOpen: boolean = false;
  @Input() notifications = [];

  public isDarkTheme = false;

  private division = this.sessionStorageService.getSession('division');
  private role = this.sessionStorageService.getSession('access');

    @HostListener('document:click', ['$event', '$event.target'])
      onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (!targetElement) {
          return;
        }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          this.isOpen = false;
        }
    }

  	constructor(
      public dialog: MatDialog,
      private elementRef: ElementRef,
      public notif: NotificationsService,
      private sessionStorageService: SessionStorageService,
      private router:Router,
      // private pr: PrService,
    ) { }

  	ngOnInit() {
      this.loadNotifications(this.division, this.role);
  	}

    loadNotifications(division, role) {
      this.notif.viewNotifications(division, role)
      .subscribe(data => {
        let result:any = data;
        this.notif.notificationContent = result;
      });
    }

    toggleTheme(ThemeName) {

      this.isDarkTheme = !this.isDarkTheme;
      // const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;

      // if (this.isDarkTheme) {
      //   overlayContainerClasses.add('dark-theme');
      //   console.log(overlayContainerClasses);

      // } else {
      //   overlayContainerClasses.remove('dark-theme');
      // }
    }

  	select(selectedPrNO:string, notif_id) {
      this.isOpen = false;
      //console.log(notif_id);
      // const queryParams = { prnum: selectedPrNO };
      // const navigationExtras: NavigationExtras = {
      //   queryParams,
      //   queryParamsHandling: 'merge' // 'merge' will merge the new parameters with the existing ones
      // };

      this.router.navigateByUrl('/auth/pages/viewPR', { skipLocationChange: true });
      //   this.router.navigate(['/auth/pages/viewItems'], navigationExtras);
      // });
      const dialogRef = this.dialog.open(ItemsViewComponent, {
        panelClass: ['no-padding'],
        data: {
          containerWidth: '1000px',
          headerText: `Pr Number: ${selectedPrNO}`,
          prNumber: selectedPrNO,
        }
      });

  	}

  	delete(notif_id) {
      this.notif.updateOneNotification(notif_id, this.role)
      .subscribe(data => {
        console.log(data);
        this.loadNotifications(this.division, this.role);
      });
  	}

    markAllAsRead() {
      console.log(this.notif.notificationContent);

      this.notif.markAllAsRead(this.notif.notificationContent, this.role)
      .subscribe(data => {
        console.log(data);
        this.loadNotifications(this.division, this.role);
      });
    }
}
