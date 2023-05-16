import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { PrEditComponent } from '../modals/pr-edit/pr-edit.component';
import { SessionStorageService } from '../../services/session-storage.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public document:PrService, private router:Router, public dialog: MatDialog, private sessionStorageService:SessionStorageService) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
   }

  ngOnInit(): void {
    var prdivision = localStorage.getItem("division")

    this.role = this.sessionStorageService.getSession("access");

    this.document.loadPR()
    .subscribe(data => {
      this.result = data;
      this.document.dataSourcePRTable = new MatTableDataSource(this.result);
      this.document.dataSourcePRTable.paginator = this.paginator;
    });
  }

  viewpritems(selectedPrNO, selectedRemarks) {
    if (selectedPrNO == null) {
      return;
    }
    this.router.navigate(['/auth/pages/viewItems'], { queryParams: { prnum: selectedPrNO, remarks: selectedRemarks } });
  }

   //table controls
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.document.dataSourcePRTable.filter = filterValue.trim();
  }

  onPrintPr(prno) {
    window.open(`http://192.168.10.32:81/eprms/print2.php?prno=${prno}`, '_blank')
  }

  cancelpritems(prno) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: 'Are you sure you want to cancel this pr?',
        number: prno
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
