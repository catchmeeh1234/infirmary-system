import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.scss']
})
export class ViewDocumentsComponent implements OnInit {
  public dataSource:any;
  public displayedColumns = ['VoucherNo', 'CheckNo', 'Date', 'Supplier', 'Category', 'Actions'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:DocumentService) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
  }

  ngOnInit(): void {
    this.document.loadDocuments1(this.selectedYear)
    .subscribe(data => {
      console.log(data);
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      this.dataSource.paginator = this.paginator;

      this.getYearsArray();
    });

  }

  //get years from 10 years a go up to now
  getYearsArray() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const years = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    this.arrayOfYears = years;
  }

  selectItem(year: string) {
    this.selectedYear = year;
    this.yearButton = year;

    this.document.loadDocuments1(this.selectedYear)
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      this.dataSource.paginator = this.paginator;

    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

