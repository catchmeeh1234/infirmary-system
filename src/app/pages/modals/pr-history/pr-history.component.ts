import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrService } from '../../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pr-history',
  templateUrl: './pr-history.component.html',
  styleUrls: ['./pr-history.component.scss']
})
export class PrHistoryComponent implements OnInit {
  public pr_history:any;
  public displayedColumns = ['Status', 'Date'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<PrHistoryComponent>,
    private pr:PrService
  ) { }

  ngOnInit(): void {
    this.pr.prHistory(this.data.prnumber)
    .subscribe(data => {
      let result:any = data;
      //this.pr_history = result;
      //console.log(result);

      for (const prhistory of result) {
        if (prhistory.pr_status === "For DM Approval") {
          prhistory.pr_status = "PR Created";
        } else if (prhistory.pr_status === "For Budget Checking") {
          prhistory.pr_status = "Approved by DM";
        } else if (prhistory.pr_status === "For Cash Allocation") {
          prhistory.pr_status = "Approved in Budge Checking";
        } else if (prhistory.pr_status === "For Printing") {
          prhistory.pr_status = "Approved in Cash Allocation";
        }
      }

      this.pr_history = new MatTableDataSource(result);

    });
  }

}
