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
import { environment } from '../../../environments/environment';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ItemsViewComponent implements OnInit {
  expandedElement: any | null;

  public dataSource:any;

  public displayedColumns = ['pr_items', 'pr_quantity', 'pr_unit', 'pr_cost'];
  //public displayedColumns = ['PRItems', 'PRQuantity', 'PRUnit', 'PRCost', 'TotalCost'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;
  public remarks:string;
  public current_status:string;
  public prnumber:string;
  public dateCreated:string;
  public requestor:string;
  public print_counter:string;

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
  public isShowReroute: boolean = false;

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

  checkReroute() {
    if (this.access != 'Encoder' && this.prequeststatus !== 'For DM Approval' && this.prequeststatus !== 'Cancelled' && !this.prequeststatus.includes("Disapprove")) {
      if (this.access === 'Budget' && this.prequeststatus === 'For Budget Checking') {
        return this.isShowReroute = true;
      }
      if(this.access === 'Cash' && this.prequeststatus === 'For Cash Allocation') {
        return this.isShowReroute = true;
      }
      //for GM
      if(this.prequeststatus === 'For Printing') {
        return this.isShowReroute = true;
      }
      return this.isShowReroute = false;
    } else {
      return this.isShowReroute = false;
    }
  }

  loadPRDetails(prnum) {
    this.prnumber = prnum;
    this.document.loadPrAndItems(prnum)
    .subscribe((data:any) => {
      this.result = data;

      if (this.result.length === 1) {
        //populate the form input with data from the database
        for (const prDetails of this.result) {
          this.prequeststatus = prDetails.pr_status;
          this.prequestdivision = prDetails.pr_division;
          this.purpose = prDetails.pr_purpose;
          this.remarks = prDetails.remarks;
          this.current_status = prDetails.pr_status;
          this.dateCreated = prDetails.pr_dateCreated;
          this.requestor = prDetails.pr_requestor;
          this.print_counter = prDetails.print_counter;
          this.dataSource = new MatTableDataSource(prDetails.items);

          this.dataSource.paginator = this.paginator;
        }
      }


      setTimeout(() => {
        this.checkApproveDisapproveButton();
        this.checkCancelButton();
        this.checkReroute();

      }, 0);
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
        //console.log('closed' + result);

      }
    });
  }

  onPrintPr() {
    //update print counter
    this.document.updatePRPrintCounter(this.prnumber)
    .subscribe((data:any) => {
      console.log(data);
      if (data.status === "1") {
          window.open(`${environment.API_URL}/PR/printing/index.php?prno=${this.prnumber}`, '_blank');
          this.loadPRDetails(this.prnumber);

      }
    });


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

        if (stat === "Re-route") {
          this.isBtnApproval = false;
        } else {
          this.isBtnApproval = true;
        }

        this.prUpdateStatus.updatePrRequest(this.prnumber, this.prequeststatus, stat, result.remarks, this.prequestdivision);
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
        headerText: 'PR History',
        prnumber: prno,
      }
    });
  }
}
