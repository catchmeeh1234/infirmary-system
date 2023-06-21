import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationsService } from '../../services/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

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

  public statusColor:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public document:PrService,
    private router:Router,
    private websock: WebSocketService,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService,
    public dialog:MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.onDisplayApprovedPr();
    console.log(this.div, this.access)
  }

  onDisplayApprovedPr() {

    this.document.approvePr(this.div, this.access)
    .subscribe(data => {
      this.result = data;
      this.document.dataSource = new MatTableDataSource(this.result);

      this.document.dataSource.paginator = this.paginator;

    });


  }

  onUpdateApproveStatus(selectedPrNO:string, selectedStatus:string, selectedDivision:string, stat:string) {
    const username = localStorage.getItem('fullname')
    if (selectedPrNO == null) {
      return;
    }
    console.log("selected " + selectedStatus);
    console.log(stat);

    let is_remarks_visible:boolean;
    if (stat === "Approve") {
      is_remarks_visible = false;
    } else if(stat === "Disapprove") {
      is_remarks_visible = true;
    } else {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: `Are you sure you want to ${stat}?`,
        isRemarksVisible: is_remarks_visible,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }

      if (result.confirm === 'yes') {
        const config: MatSnackBarConfig = {
          verticalPosition: 'top',
          duration: 5000,
          panelClass: ['statusSuccess']
        };

        let params = new FormData();
        let status:string;

        if (result.remarks == undefined || result.remarks == null || result.remarks == "") {
          result.remarks = "";
        }

        params.append('prno', selectedPrNO);
        params.append('remarks', result.remarks);
        params.append('pr_status', stat);
        params.append('pr_request_status', selectedStatus);
        params.append('name', this.sessionStorageService.getSession('fullname'));

        this.document.updatePrRequest(params)
        .subscribe(data => {
          let result:any = data;
          if (result.status === "Success") {
            this.statusColor = 'statusSuccess';

            let title:string;
            let message:string;
            if (stat === "Disapprove") {
              title = `Purchase Request ${stat}`;
              message = `Purchase Request: ${selectedPrNO} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;
              status = `${stat}(${selectedStatus})`;
              // if (this.data.pr_status === "Cancelled") {
              //   status = this.data.pr_status;
              // } else if(this.data.pr_status === "Disapprove") {
              //   status = `${this.data.pr_status}(${this.data.pr_request_status})`;
              // }
            } else {
              if (stat === "Approve") {
                title = `Pending Purchase Request Approval`;
                message = `Purchase Request: ${selectedPrNO} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;

                if (selectedStatus === "For DM Approval") {
                  status = "For Budget Checking";
                }else if (selectedStatus === "For Budget Checking") {
                  status = "For Cash Allocation";
                } else if (selectedStatus === "For Cash Allocation") {
                  status = "For Printing";
                }

              }
            }

            this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), this.sessionStorageService.getSession('division'), status, selectedPrNO).subscribe(data => {
              //this.websock.status_message = devicedeveui;
              console.log(data);
            });

            this.websock.sendNotif(message);
            this.websock.updateNotification();
            this.websock.updatePRTable();

          } else {
            this.statusColor = 'statusFailed';
          }
          config.panelClass = [this.statusColor];
          this.snackBar.open(`${stat} ${result.status}`, 'Close', config);
          this.websock.updateApprovePR();
        });

      } else {
        return;
      }

        // this.document.updateApproveStatus(selectedPrNO, selectedStatus, username, stat)
        // .subscribe(data=>{
        //   let status:string;
        //   let title:string;
        //   let message:string;

        //   if (data === "PR Status Updated") {
        //     this.websock.updateApprovePR();

            // if (stat === "Approve") {
            //   title = 'Pending Purchase Request Approval';
            //   message = `Purchase Request: ${selectedPrNO} has been approved by ${this.sessionStorageService.getSession('username')}`;
            // }

            // if (stat === "Disapprove") {
            //   title = 'Purchase Request Disapproved';
            //   message = `Purchase Request: ${selectedPrNO} has been disapproved by ${this.sessionStorageService.getSession('username')}`;
            // }

            // if (selectedStatus === "For DM Approval") {
            //   status = "For Budget Checking";
            //   console.log(status);

            // }else if (selectedStatus === "For Budget Checking") {
            //   status = "For Cash";
            //   console.log(status);

            // } else if (selectedStatus === "For Cash") {
            //   status = "For Printing";
            //   console.log(status);

            // } else {
            //   console.log("wala");

            // }

            // this.notif.insertNotification(title, message, this.access, selectedDivision, status, selectedPrNO).subscribe(data => {
            //   //this.websock.status_message = devicedeveui;
            //   console.log(data);
            // });

            // this.websock.sendNotif(message);
            // this.websock.updateNotification();
          // } else {
          //   console.log(data);
          // }
        //});
      //}
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
