import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { EmployeeService } from '../../services/employee.service';
import { DateFormatService } from '../../services/date-format.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-pr-filter-button',
  templateUrl: './pr-filter-button.component.html',
  styleUrls: ['./pr-filter-button.component.scss']
})
export class PrFilterButtonComponent implements OnInit {
  public isOpen:boolean = false;

  public divisions:any;
  selectedDivision: string = 'All';
  selectedStatus: string = 'All';
  selectedRequestor: string = 'All';
  search:string = "";
  selectedDate:Date;

  public pr_label_statuses:any;
  public pr_requestors:any;

  // @HostListener('document:click', ['$event', '$event.target'])
  // onClick(event: MouseEvent, targetElement: HTMLElement) {
  //   if (!targetElement) {
  //      return;
  //   }


  //   //const clickedInside = this.elementRef.nativeElement.contains(targetElement);
  //   //console.log(clickedInside);

  //   // if (!clickedInside) {
  //   //     this.isOpen = false;
  //   // }
  // }
  constructor(private elementRef: ElementRef, private pr:PrService, private emp:EmployeeService, private dateFormat:DateFormatService, private sessionStorageService:SessionStorageService) {

  }

  ngOnInit(): void {
    this.onLoadFilterOptions();
    setTimeout(() => {
      //this.pr.dataSourcePRTable.filterPredicate = null;
      this.pr.dataSourcePRTable.filterPredicate = (data: any, filter: string) => {
        const filters = JSON.parse(filter);
        return (
          (!filters.div || data.pr_division.toLowerCase() === filters.div.toLowerCase()) &&
          (!filters.status || data.pr_status.toLowerCase() === filters.status.toLowerCase()) &&
          (!filters.requestor || data.pr_requestor.toLowerCase() === filters.requestor.toLowerCase()) &&
          (!filters.date || data.pr_dateCreated.toLowerCase() === filters.date.toLowerCase()) &&
          (!filters.search || data.pr_no.includes(filters.search))
        );
      };
    }, 500);
  }

  onLoadFilterOptions() {
    this.pr.getDivisions()
    .subscribe(data =>{
      this.divisions = data;
    });

    this.pr.getPrLabelStatus()
    .subscribe(data =>{
      this.pr_label_statuses = data;
    });

    this.emp.getEmp(this.sessionStorageService.getSession("division"))
    .subscribe(data =>{
      this.pr_requestors = data;
    });
  }

  closeFilterLabel(filterlabel) {
    if (filterlabel === "Division") {
      this.selectedDivision = "All";
    } else if (filterlabel === "Status") {
      this.selectedStatus = "All";
    } else if (filterlabel === "Requestor") {
      this.selectedRequestor = "All";
    } else if (filterlabel === "Date") {
      this.selectedDate = null;
    } else if (filterlabel === "Reset") {
      this.selectedDivision = "All";
      this.selectedStatus = "All";
      this.selectedRequestor = "All";
      this.selectedDate = null;
    } else {
      return;
    }

    this.filterTable(this.search, this.selectedDivision, this.selectedStatus, this.selectedRequestor, this.selectedDate);

  }

  resetFilterTable() {
    this.selectedDivision = 'All';
    this.selectedStatus = 'All';
    this.selectedRequestor = 'All';
    this.search = "";
    this.selectedDate = null;

    this.filterTable(this.search, this.selectedDivision, this.selectedStatus, this.selectedRequestor, this.selectedDate);
  }

  filterTable(search:string, filterDiv:string, filterStatus:string ,filterRequestor:string, filterDate:Date) {

    let formattedDate:string;

    if (this.isOpen === true) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
    if (filterDiv === "All") {
      filterDiv = "";
    }
    if (filterStatus === "All") {
      filterStatus = "";
    }
    if (filterRequestor === "All") {
      filterRequestor = "";
    }
    if (formattedDate === "All") {
      formattedDate = "";
    }
    formattedDate = this.dateFormat.formatDate(filterDate);

    //this.pr.dataSourcePRTable.filter = filterDiv.trim().toLowerCase();
    this.pr.dataSourcePRTable.filter = JSON.stringify({
      div: filterDiv,
      status: filterStatus,
      requestor: filterRequestor,
      search: search,
      date: formattedDate,
    });
  }
}
