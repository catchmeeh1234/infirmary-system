import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserAccountViewComponent } from '../../modals/user-account-view/user-account-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent implements OnInit {

  public displayedColumns = ['Empid', 'Username', 'Fullname', 'Division', 'Designation', 'Access', 'Actions'];
  public result:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public user:UserService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.loadUserAccounts();
  }

  loadUserAccounts() {
    this.user.fetchAllUserAccounts()
    .subscribe(data => {
      this.result = data;
      this.user.dataSourceUser = new MatTableDataSource(this.result);
      this.user.dataSourceUser.paginator = this.paginator;
    });
  }

  viewUserAccount(userid, isForm_disabled:boolean, header_text:string) {
    if (userid == null) {
      return;
    }

    const dialogRef = this.dialog.open(UserAccountViewComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '1000px',
        headerText: header_text,
        user_id: userid,
        isFormDisabled: isForm_disabled,
      }
    });
  }
}
