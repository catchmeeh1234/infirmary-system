import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrEditComponent } from '../modals/pr-edit/pr-edit.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { PrUpdateStatusService } from '../../services/pr-update-status.service';
import { PrHistoryComponent } from '../modals/pr-history/pr-history.component';
import { API_URL } from '../../constants';

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
  public current_status:string;
  public prnumber:string;
  public timestamp:string;
  public requestor:string;

  public prequeststatus:string;
  public prequestdivision:string;
  public purpose:string;
  public isBtnApproval:boolean = false;

  //logged in user's details
  public username = this.sessionStorageService.getSession('fullname');
  public access = this.sessionStorageService.getSession('access');
  public division = this.sessionStorageService.getSession('division').toUpperCase();
  public isShowApproveDisapprove: boolean = false;
  public isShowCancelled: boolean = false;

  public statusColor:string;

  public disDate:string;
  public disStatus:string;
  public disBy:string;

  public StatusResult:any;
  public ResStatus:string;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              private document:PrService,
              private router:Router,
              public dialog: MatDialog,
              private sessionStorageService:SessionStorageService,
              private prUpdateStatus:PrUpdateStatusService
  ) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
  }

  ngOnInit(): void {
    //const url = new URL(window.location.href);
    //const prnum = url.searchParams.get("prnum");
    const prnum = this.data.prNumber;
    this.loadPRDetails(prnum);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.prnumber) {
  //     // Perform actions when myVariable changes
  //     console.log('myVariable changed:');
  //   }
  // }

  checkApproveDisapproveButton() {
    if (this.access === 'Encoder') {
      console.log(1);
      return this.isShowApproveDisapprove = false;
    }
    if(this.access === 'Approver' && this.division == this.prequestdivision && this.prequeststatus === 'For DM Approval') {
      console.log(3);
      return this.isShowApproveDisapprove = true;
    }
    if(this.access === 'Budget' && this.prequeststatus === 'For Budget Checking') {
      console.log(4);
      return this.isShowApproveDisapprove = true;
    }
    if(this.access === 'Cash' && this.prequeststatus === 'For Cash Allocation') {
      console.log(5);
      return this.isShowApproveDisapprove = true;
    }
    if(this.prequeststatus === 'Disapprove') {
      console.log(6);
      return this.isShowApproveDisapprove = false;
    }
    if(this.prequeststatus === 'Cancelled') {
      console.log(7);
      return this.isShowApproveDisapprove = false;
    }
  }

  checkCancelButton() {
    if (this.access === 'Encoder' && this.division === this.prequestdivision && this.prequeststatus !== 'Cancelled' && this.prequeststatus !== 'For Printing' && !this.prequeststatus.includes("Disapprove")) {
      return this.isShowCancelled = true;
    } else {
      return this.isShowCancelled = false;
    }
  }

  loadPRDetails(prnum) {
    this.prnumber = prnum;
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
      this.current_status = result[0].pr_status;
      this.timestamp = result[0].timestamp;
      this.requestor = result[0].pr_requestor;

      setTimeout(() => {
        this.checkApproveDisapproveButton();
        this.checkCancelButton();
      }, 0);

    });

    this.document.telLDisapprove(prnum)
    .subscribe(data => {
      let result:any = data;
      if (result == null) {
        this.StatusResult = result = [];
      } else {
        this.StatusResult = result;
        this.disDate = result[0].pr_datetime;
        this.disBy = result[0].pr_updatedBy;
      }
    });

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

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      } else {

        this.loadPRDetails(result);
        console.log('closed' + result);

      }
    });


  }

  onPrintPr() {
    window.open(`${API_URL}/printing/index.php?prno=${this.prnumber}`, '_blank');
  }

  onUpdateApproveStatus(stat:string, is_remarks_visible:boolean) {
    if (this.prnumber == null) {
      return;
    }

    //let is_remarks_visible:boolean;

    // if (stat === "Approve") {
    //   is_remarks_visible = false;
    // } else if(stat === "Disapprove") {
    //   is_remarks_visible = true;
    // } else if(stat === "Cancelled"){
    //   is_remarks_visible = true;
    // } else {
    //   return;
    // }

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
      // Handle the result if needed
      if (result.confirm === 'yes') {
        this.isBtnApproval = true;
        this.prUpdateStatus.updatePrRequest(this.prnumber, this.prequeststatus, stat, result.remarks);
        setTimeout(() => {
          this.loadPRDetails(this.prnumber);

          this.document.approvePr(this.division, this.access)
          .subscribe(data => {
            this.result = data;

            this.document.dataSource = new MatTableDataSource(this.result);

            this.document.dataSource.paginator = this.paginator;

          });
        }, 500);
      } else {
        return;
      }
    });
  }

  viewHistoryPR(prno:string) {
    const dialogRef = this.dialog.open(PrHistoryComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '700px',
        headerText: 'Pr History',
        prnumber: prno,
      }
    });
  }
}
