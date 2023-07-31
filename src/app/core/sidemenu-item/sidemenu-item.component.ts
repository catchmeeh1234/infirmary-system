import { Component, OnInit, Input } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'cdk-sidemenu-item',
  templateUrl: './sidemenu-item.component.html',
  styleUrls: ['./sidemenu-item.component.scss']
})
export class SidemenuItemComponent implements OnInit {

  @Input() menu;
  @Input() iconOnly: boolean;
  @Input() secondaryMenu = false;

  public role:string;

  constructor(private sessionStorageService:SessionStorageService) {
  }

  ngOnInit() {
    this.role = this.sessionStorageService.getSession("access");
  }

  openLink() {
    this.menu.open = this.menu.open;
  }

  chechForChildMenu() {
    return (this.menu && this.menu.sub) ? true : false;
  }

}
