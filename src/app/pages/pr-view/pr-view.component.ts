import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { PrEditComponent } from '../modals/pr-edit/pr-edit.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationsService } from '../../services/notifications.service';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-pr-view',
  templateUrl: './pr-view.component.html',
  styleUrls: ['./pr-view.component.scss']
})
export class PrViewComponent implements OnInit {
  public dataSource:any;
  public displayedColumns = ['PRNo', 'Date', 'Requestor', 'Designation', 'Division', 'Purpose', 'Status', 'Actions'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;
  public selectedPrNO:string;

  public role: string;
  public division:string;

  public isShowCancelled:boolean;
  public statusColor:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public document:PrService,
              private router:Router,
              public dialog: MatDialog,
              private sessionStorageService:SessionStorageService,
              private snackBar: MatSnackBar,
              private notif:NotificationsService,
              private websock:WebSocketService
  ) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
   }

  ngOnInit(): void {
    var prdivision = localStorage.getItem("division");
    this.division = this.sessionStorageService.getSession("division").toUpperCase();
    this.role = this.sessionStorageService.getSession("access");
    console.log(this.role);
    this.document.loadPR()
    .subscribe(data => {
      this.result = data;
      this.document.dataSourcePRTable = new MatTableDataSource(this.result);
      this.document.dataSourcePRTable.paginator = this.paginator;
    });
  }

  viewpritems(selectedPrNO) {
    if (selectedPrNO == null) {
      return;
    }
    this.router.navigate(['/auth/pages/viewItems'], { queryParams: { prnum: selectedPrNO } });
  }

   //table controls
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.document.dataSourcePRTable.filter = filterValue.trim();
  }

  onPrintPr(prno) {
    window.open(`http://192.168.10.32:81/eprms/print2.php?prno=${prno}`, '_blank')
  }

  cancelpritems(prno, pr_status, stat="Cancelled") {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: 'Are you sure you want to cancel this pr?',
        isRemarksVisible: true,
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

        params.append('prno', prno);
        params.append('remarks', result.remarks);
        params.append('pr_status', stat);
        params.append('pr_request_status', pr_status);
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
              message = `Purchase Request: ${prno} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;
              status = `${stat}(${pr_status})`;
              // if (this.data.pr_status === "Cancelled") {
              //   status = this.data.pr_status;
              // } else if(this.data.pr_status === "Disapprove") {
              //   status = `${this.data.pr_status}(${this.data.pr_request_status})`;
              // }
            } else if(stat === "Approve") {
                title = `Pending Purchase Request Approval`;
                message = `Purchase Request: ${prno} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;

                if (pr_status === "For DM Approval") {
                  status = "For Budget Checking";
                }else if (pr_status === "For Budget Checking") {
                  status = "For Cash Allocation";
                } else if (pr_status === "For Cash Allocation") {
                  status = "For Printing";
                }
            } else if(stat === "Cancelled") {
              title = `Purchase Request ${stat}`;
              message = `Purchase Request: ${prno} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;
              status = stat;
            }

            this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), this.sessionStorageService.getSession('division'), status, prno).subscribe(data => {
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
        });
      } else {
        return;
      }

    });

  }


  editPr(prno:string) {
    if (prno === null || prno === "") {
      return;
    }

    const dialogRef = this.dialog.open(PrEditComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '1000px',
        headerText: 'Edit Purchase Request',
        number: prno
      }
    });

  }

}
