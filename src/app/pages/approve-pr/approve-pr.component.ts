import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private document:PrService, private router:Router) { }

  ngOnInit(): void {
    var div = sessionStorage.getItem('division')
    var access = sessionStorage.getItem('access')
    //console.log(div, access);
    
    this.document.approvePr(div, access)
    .subscribe(data => {
      this.result = data;
      this.dataSource = new MatTableDataSource(this.result);

      this.dataSource.paginator = this.paginator;
    });

  }

  updateApproveStatusx(selectedPrNO, selectedStatus) {
    var username = sessionStorage.getItem('fullname')
    var button = "Approve"
    if (selectedPrNO == null) {
      return;
    }
    this.document.updateApproveStatus(selectedPrNO, selectedStatus, username, button).subscribe(data=>{

    })
    this.router.navigate(['/auth/pages/approvePr']);
    window.location.reload();
  }

  updateApproveStatusy(selectedPrNO, selectedStatus) {
    var username = sessionStorage.getItem('fullname')
    var button = "Disapprove"
    if (selectedPrNO == null) {
      return;
    }
    this.document.updateApproveStatus(selectedPrNO, selectedStatus, username, button).subscribe(data=>{

    })
    this.router.navigate(['/auth/pages/approvePr']);
    window.location.reload();
  }

}
