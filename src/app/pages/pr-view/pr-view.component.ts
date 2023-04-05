import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

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

  public sessionStorage1 = sessionStorage;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:PrService, private router:Router) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
   }

  ngOnInit(): void {
    var prdivision = sessionStorage.getItem("division")
    console.log(prdivision);

    this.document.loadPR()
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      this.dataSource.paginator = this.paginator;


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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
