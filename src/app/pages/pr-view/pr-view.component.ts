import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { PrEditComponent } from '../modals/pr-edit/pr-edit.component';
import { SessionStorageService } from '../../services/session-storage.service';
import { PrUpdateStatusService } from '../../services/pr-update-status.service';
import { PrFilterButtonComponent } from '../pr-filter-button/pr-filter-button.component';
import { ItemsViewComponent } from '../items-view/items-view.component';
import { API_URL } from '../../constants';

@Component({
  selector: 'app-pr-view',
  templateUrl: './pr-view.component.html',
  styleUrls: ['./pr-view.component.scss']
})
export class PrViewComponent implements OnInit {
  public displayedColumns = ['tagAsApprove', 'PRNo', 'Date', 'Requestor', 'Designation', 'Division', 'Status', 'Actions'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;
  public selectedPrNO:string;

  public role: string;
  public division:string;

  public isShowCancelled:boolean;
  public statusColor:string;

  public division_name:any;

  selectedFilter: string = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PrFilterButtonComponent) prFilterBox!: PrFilterButtonComponent;

  constructor(public document:PrService,
              private router:Router,
              public dialog: MatDialog,
              private sessionStorageService:SessionStorageService,
              private prUpdateStatus:PrUpdateStatusService,
  ) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
   }

  ngOnInit(): void {
    this.division = this.sessionStorageService.getSession("division").toUpperCase();
    this.role = this.sessionStorageService.getSession("access");
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

    const dialogRef = this.dialog.open(ItemsViewComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '1000px',
        headerText: `PR Number: ${selectedPrNO}`,
        prNumber: selectedPrNO,
      }
    });

    //this.router.navigate(['/auth/pages/viewItems'], { queryParams: { prnum: selectedPrNO } });
  }

  onPrintPr(prno) {
    window.open(`${API_URL}/printing/index.php?prno=${prno}`, '_blank');
  }

  onPrintPreview(prno) {
    window.open(`${API_URL}/printing/previewprint.php?prno=${prno}`, '_blank');
  }

  updatePR_Status(prno, pr_status, stat, remarks_visible:boolean, pr_division:string) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: 'Please Confirm your selection',
        isRemarksVisible: remarks_visible,
      }
    });



    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }

      if (result.confirm === 'yes') {
        this.prUpdateStatus.updatePrRequest(prno, pr_status, stat, result.remarks, pr_division);
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

  closeFilterOptions() {
    this.prFilterBox.isOpen = false;
  }

}
