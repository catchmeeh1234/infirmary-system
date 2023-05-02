import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-approve-pr',
  templateUrl: './approve-pr.component.html',
  styleUrls: ['./approve-pr.component.scss']
})
export class ApprovePrComponent implements OnInit {
  public dataSource:any;
  public result:any;
  public displayedColumns = ['PRNo', 'PRDate', 'PRRequestor', 'PRDesignation', 'PRDivision', 'PRPurpose', 'PrAction'];
  public sessionStorage = sessionStorage;

  public div = localStorage.getItem('division');
  public access = localStorage.getItem('access');

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public document:PrService,
    private router:Router,
    private websock: WebSocketService,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService
  ) { }

  ngOnInit(): void {
    this.onDisplayApprovedPr();
  }

  onDisplayApprovedPr() {

    this.document.approvePr(this.div, this.access)
    .subscribe(data => {
      this.result = data;
      this.document.dataSource = new MatTableDataSource(this.result);

      this.document.dataSource.paginator = this.paginator;
    });
  }

  onUpdateApproveStatus(selectedPrNO, selectedStatus, selectedDivision, stat) {

    var username = localStorage.getItem('fullname')
    if (selectedPrNO == null) {
      return;
    }
    this.document.updateApproveStatus(selectedPrNO, selectedStatus, username, stat)
    .subscribe(data=>{
      let status:string;
      let title:string;
      let message:string;

      if (data === "PR Status Updated") {
        this.websock.updateApprovePR();

        if (stat === "Approve") {
          title = 'Purchase Request Approved';
          message = `Purchase Request: ${selectedPrNO} has been approved by ${this.sessionStorageService.getSession('username')}`;
        }

        if (stat === "Disapprove") {
          title = 'Purchase Request Disapproved';
          message = `Purchase Request: ${selectedPrNO} has been disapproved by ${this.sessionStorageService.getSession('username')}`;
        }

        if (selectedStatus === "For Approve") {
          status = "For Budget Checking";
        }else if (selectedStatus === "For Budget Checking") {
          status = "For Cash";
        } else if (selectedStatus === "For Cash") {
          status = "For Printing";
        }

        this.notif.insertNotification(title, message, this.access, selectedDivision, status, selectedPrNO).subscribe(data => {
          //this.websock.status_message = devicedeveui;
          console.log(data);
        });

        this.websock.sendNotif(message);
        this.websock.updateNotification();


      } else {
        console.log(data);
      }
    });

  }

  // updateApproveStatusy(selectedPrNO, selectedStatus, selectedDivision, stat) {
  //   var username = sessionStorage.getItem('fullname')
  //   if (selectedPrNO == null) {
  //     return;
  //   }
  //   this.document.updateApproveStatus(selectedPrNO, selectedStatus, username, stat).subscribe(data=>{
  //     let status:string;

  //     if (data === "PR Status Updated") {
  //       this.websock.updateApprovePR();

  //       let title = 'Purchase Request Disapproved';
  //       let message = `Purchase Request: ${selectedPrNO} has been disapproved by ${this.sessionStorageService.getSession('username')}`;

  //       status = "Disapproved";

  //       this.notif.insertNotification(title, message, this.access, selectedDivision, status, selectedPrNO).subscribe(data => {
  //         //this.websock.status_message = devicedeveui;
  //         console.log(data);
  //       });

  //       this.websock.sendNotif(message);
  //       this.websock.updateNotification();

  //     } else {
  //       console.log(data);
  //     }

  //   });

  // }

  //table controls
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.document.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
