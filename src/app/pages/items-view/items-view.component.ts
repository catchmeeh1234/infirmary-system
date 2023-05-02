import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})
export class ItemsViewComponent implements OnInit {
  public dataSource:any;
  public displayedColumns = ['PRNo', 'PRItems', 'PRQuantity', 'PRUnit', 'PRCost', 'TotalCost', 'Actions'];
  public result:any;
  public arrayOfYears:any;
  public selectedYear:string;
  public yearButton:string;
  public remarks:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:PrService, private router:Router) {
    this.arrayOfYears = [];
    this.selectedYear = new Date().getFullYear().toString();
    this.yearButton = this.selectedYear;
  }

  ngOnInit(): void {
    var url = new URL(window.location.href);
    var prnum = url.searchParams.get("prnum");
    this.remarks = url.searchParams.get("remarks");
    //console.log(prnum);

    this.document.loadItems(prnum)
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      //this.dataSource.paginator = this.paginator;
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

}
