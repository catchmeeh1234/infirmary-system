import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PrEditComponent } from '../modals/pr-edit/pr-edit.component';
import { WebSocketService } from '../../services/web-socket.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})

export class ItemsViewComponent implements OnInit {
  public dataSource:any;
  public dataSource1:any;
  //public displayedColumns = ['PRNo', 'PRItems', 'PRQuantity', 'PRUnit', 'PRCost', 'TotalCost', 'Actions'];
  public displayedColumns = ['PRItems', 'PRQuantity', 'PRUnit', 'PRCost', 'TotalCost'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;
  public remarks:string;
  public prnumber:string;

  public prequeststatus:string;
  public prequestdivision:string;
  public purpose:string;
  public isBtnApproval:boolean = false;

  //logged in user's details
  public username = this.sessionStorageService.getSession('fullname');
  public access = this.sessionStorageService.getSession('access');
  public division = this.sessionStorageService.getSession('division').toUpperCase();
  public isShowApproveDisapprove: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:PrService,
              private router:Router,
              public dialog: MatDialog,
              private websock:WebSocketService,
              private sessionStorageService:SessionStorageService,
              private notif: NotificationsService
  ) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
  }

  ngOnInit(): void {
    var url = new URL(window.location.href);
    var prnum = url.searchParams.get("prnum");
    this.prnumber = url.searchParams.get("prnum");

    this.document.loadItems(prnum)
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      this.dataSource.paginator = this.paginator;
    });

    this.document.getPurpose(prnum)
    .subscribe(data => {
      let result:any = data;
      this.prequeststatus = result[0].pr_status;
      this.prequestdivision = result[0].pr_division;
      this.purpose = result[0].pr_purpose;
      this.remarks = result[0].remarks;
      if (this.access === 'Encoder') {
        console.log(1);
        return this.isShowApproveDisapprove = false;
      }
      if(this.access === 'Approver' && this.division == this.prequestdivision && this.prequeststatus === 'For DM Approval') {
        console.log(2);
        return this.isShowApproveDisapprove = true;
      }
      if(this.access === 'Budget' && this.prequeststatus === 'For Budget Checking') {
        console.log(3);
        return this.isShowApproveDisapprove = true;
      }
      if(this.access === 'Cash' && this.prequeststatus === 'For Cash Allocation') {
        console.log(4);
        return this.isShowApproveDisapprove = true;
      }
      if(this.prequeststatus === 'Disapprove') {
        console.log(5);
        return this.isShowApproveDisapprove = false;
      }
      if(this.prequeststatus === 'Cancelled') {
        console.log(6);
        return this.isShowApproveDisapprove = false;
      }

    });

    const pr_title: any[] = [
      {
        Title: prnum
      }
    ];
  }

  PRBack() {
    this.router.navigate(['/auth/pages/viewPR']);
  }

  editPR() {
    if (this.prnumber === null || this.prnumber === "") {
      return;
    }

    const dialogRef = this.dialog.open(PrEditComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '1000px',
        headerText: 'Edit Purchase Request',
        number: this.prnumber
      }
    });
  }

  onPrintPr() {
    window.open(`http://192.168.10.32:81/eprms/print2.php?prno=${this.prnumber}`, '_blank')
  }

  onUpdateApproveStatus(stat) {

    if (this.prnumber == null) {
      return;
    }
    this.document.updateApproveStatus(this.prnumber, this.prequeststatus, this.username, stat)
    .subscribe(data=>{
      let status:string;
      let title:string;
      let message:string;

      if (data === "PR Status Updated") {
        this.websock.updateApprovePR();
        this.isBtnApproval = true;

        if (stat === "Approve") {
          title = 'Purchase Request Approved by DM';
          message = `Purchase Request: ${this.prnumber} has been approved by ${this.sessionStorageService.getSession('username')}`;
        }

        if (stat === "Disapprove") {
          title = 'Purchase Request Disapproved';
          message = `Purchase Request: ${this.prnumber} has been disapproved by ${this.sessionStorageService.getSession('username')}`;
        }

        if (this.prequeststatus === "For DM Approval") {
          status = "For Budget Checking";
        }else if (this.prequeststatus === "For Budget Checking") {
          status = "For Cash";
        } else if (this.prequeststatus === "For Cash") {
          status = "For Printing";
        }

        this.notif.insertNotification(title, message, this.access, this.prequestdivision, status, this.prnumber).subscribe(data => {
          console.log(data);
        });

        this.websock.sendNotif(message);
        this.websock.updateNotification();


      } else {
        console.log(data);
      }
    });

  }

}
