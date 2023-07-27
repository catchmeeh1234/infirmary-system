import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationsService } from '../../services/notifications.service';
import { WebSocketService } from '../../services/web-socket.service';
import { EmployeeService } from '../../services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemsViewComponent } from '../items-view/items-view.component';
import { ConfirmationComponent } from '../modals/confirmation/confirmation.component';
import { DateFormatService } from '../../services/date-format.service';
//import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-pr-add',
  templateUrl: 'pr-add.component.html',
  styleUrls: ['pr-add.component.scss']
})


export class PrAddComponent implements OnInit {
  public dataSource:any;
  //public displayedColumns = ['PRNo','DateCreated','Requestor','Designation','Division','Purpose','PRStatus'];
  public prload;
  public prNumber:any;
  public units:any;
  public divisions:any;
  public selectedDivision:string;
  public selectedDesignation:string;

  public pr_types:any;

  public addForm: FormGroup;
  public isAddFormValid: boolean = false;

  private div = this.sessionStorageService.getSession("division");

  //format 2023-07-27

  options: any;
  filteredOptions: any;

  constructor(
    private document:PrService,
    private fb:FormBuilder,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService,
    public websock: WebSocketService,
    private employee: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog:MatDialog,
    private dateFormat:DateFormatService
  ) {
    // this.productForm = this.fb.group({
    //   quantities: this.fb.array([]) ,
    // });
  }

  ngOnInit(): void {

    this.addForm = this.fb.group({
      pr_requestor: ['', Validators.required],
      pr_date: [new Date(), Validators.required],
      pr_division: ['' , Validators.required],
      pr_designation: ['', Validators.required],
      pr_purpose: ['', Validators.required],
      pr_status: ['For DM Approval', Validators.required],
      pr_title: [''],
      pr_items: this.fb.array([]),
    });
    //disable some inputs
    this.addForm.get('pr_status')?.disable();
    this.addForm.get('pr_designation')?.disable();
    this.addForm.get('pr_division')?.disable();

     //listen to any value change on add form
     this.addForm.valueChanges.subscribe(val => {
      if (!this.addForm.get('pr_requestor').valid || !this.addForm.get('pr_date').valid || !this.addForm.get('pr_purpose').valid) {
        this.isAddFormValid = false;
      } else {
        this.isAddFormValid = true;
      }
    });

    this.document.loadPRNo()
    .subscribe(data => {
      this.websock.response = data;
    });

    this.dataSource = new MatTableDataSource(this.websock.response);

    this.onDisplayUnitMeasurements();
    this.onDisplayDivisions();
    this.onDisplayPRTypes();
    this.getAllData(this.sessionStorageService.getSession('division'));
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.full_name.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const selectedValue = event.option.value;

    this.employee.selectEmployee(selectedValue)
    .subscribe(data => {
      let result:any = data;
      this.addForm.get('pr_division').setValue(result[0].division);
      this.addForm.get('pr_designation').setValue(result[0].designation);
      //this.designation.setValue(result[0].designation);
    });
    // Update the other field with the selected value
    // this.otherControl.setValue(selectedValue);
  }

  onDisplayUnitMeasurements() {
    this.document.getUnitMeasurements()
    .subscribe(data => {
      this.units = data;
    });
  }

  onDisplayDivisions() {
    this.document.getDivisions()
    .subscribe(data => {
      this.divisions = data;
    });
  }

  onDisplayPRTypes() {
    this.document.loadPRTypes()
    .subscribe(data => {
      this.pr_types = data;
    });
  }

  //function for adding PR items
  // Helper method to get the item FormArray
  get itemFormArray(): FormArray {
    return this.addForm.get('pr_items') as FormArray;
  }

  addItem() {
    this.itemFormArray.push(this.createItemGroup());
  }

  removeItem(i:number) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      panelClass: ['no-padding'],
      data: {
        containerWidth: '500px',
        headerText: 'Confirmation',
        message: 'Are you sure you want to remove this item?',
        isRemarksVisible: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      // Handle the result if needed
      if (result.confirm === 'yes') {
        this.itemFormArray.removeAt(i);
      }
    });
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      qty: ['', [Validators.required,  Validators.pattern('^[0-9]*$')]],
      unit: ['', Validators.required],
      cost: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      pr_subitems: this.fb.array([]),
    });
  }

  //functions for subitem
  addSubItem(i:number) {
    this.subItemFormArray(i).push(this.createSubItemFormGroup());
  }

  removeSubItem(i:number, z:number) {
    this.subItemFormArray(i).removeAt(z);
  }

 // Helper method to get the item FormArray
  subItemFormArray(index: number): FormArray {
    return this.itemFormArray.at(index).get('pr_subitems') as FormArray;
  }

  // Helper method to create sub-item form controls
  createSubItemFormGroup(): FormGroup {
    return this.fb.group({
      dpr_items: ['', Validators.required],
      dpr_quantity: ['', [Validators.required,  Validators.pattern('^[0-9]*$')]],
      dpr_cost: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      dpr_unit: ['', Validators.required],
    });
  }


  onSelectChangePRType(event:any, i:number) {
    const element = document.getElementById(`sub_item_${i}`);

    const spanElement = document.querySelector(`#sub_item_${i} span`);
    if (event.value === "Details") {
      element.style.paddingLeft = '3em';
    } else {
      element.style.paddingLeft = '0em';
    }

  }

  openStatusMessage(message) {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['style-snackbar-error']
    };
    //this.snackBar.openFromComponent(StatusMessageComponent, config);

    this.snackBar.open(message, 'Dismiss', config);
  }

  clearAddPRForm() {
    let prno = <HTMLInputElement>document.querySelector('.prno');
    prno.value = this.websock.response;

    this.addForm.patchValue({
      pr_requestor: '',
      pr_date: new Date(),
      pr_division: '',
      pr_designation: '',
      pr_purpose: '',
      pr_status: 'For DM Approval',
      pr_title: '',
    });

    //disable designation, division, and pr status form input
    this.addForm.get('pr_status')?.disable();
    this.addForm.get('pr_designation')?.disable();
    this.addForm.get('pr_division')?.disable();

    //clear items array
    this.itemFormArray.clear();
  }



  addPurchaseRequest() {
    let prno = <HTMLInputElement>document.querySelector('.prno');

    //format date created
    console.log(this.addForm.value);
    console.log(this.addForm.get("pr_date").value);

    let prDate = this.dateFormat.formatDate(this.addForm.get("pr_date").value);
    console.log(prDate);
    this.addForm.patchValue({
      pr_date: prDate,
    });
    // let datecreated = <HTMLInputElement>document.querySelector('.datecreated');
    // let requestor = <HTMLInputElement>document.querySelector('.requestor');
    // let designation = <HTMLInputElement>document.querySelector('.designation');
    // let division = <HTMLInputElement>document.querySelector('.division');
    // let purpose = <HTMLInputElement>document.querySelector('.purpose');
    // let prstatus = <HTMLInputElement>document.querySelector('.prstatus');

    // let prtitle = <HTMLInputElement>document.querySelector('.pr_title');


    if (!this.addForm.valid || this.itemFormArray.length === 0) {
      this.openStatusMessage('Please Fill up necessary details');
      return;
    }

    var username = localStorage.getItem('fullname');
    // if (prno.value == "" || purpose.value == "" || requestor.value == "" || designation.value == "") {
    //   return;
    // }

    //enable designation, division, and pr status form input
    this.addForm.get('pr_status')?.enable();
    this.addForm.get('pr_designation')?.enable();
    this.addForm.get('pr_division')?.enable();

    let x = this.document.addPR(prno.value, this.addForm.value, username);


    //console.log(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value, this.productForm.value);
    //console.log(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value)
    x.subscribe(data => {
      console.log(data);

      let response:any = data;
      if (response.trim() === "Inserted Successfully") {
        let title = 'Purchase Request Created';
        let message = `Purchase Request: ${prno.value} has been created by ${this.sessionStorageService.getSession('username')}`;

        const json_notif = {
          message: message,
          notif_division: this.div
        };
        const json_email_notif = {
          prno: prno.value,
          division: this.addForm.get('pr_division').value,
          status: this.addForm.get('pr_status').value,
        };

        this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), this.addForm.get('pr_division').value, this.addForm.get('pr_status').value, prno.value).subscribe(data => {
          //this.websock.status_message = devicedeveui;
          console.log(data);
        });
        this.websock.sendNotif(json_notif);
        this.websock.updateNotification();

        if (prno.value == null) {
          return;
        }

        this.websock.sendEmailNotif(json_email_notif);

        const dialogRef = this.dialog.open(ItemsViewComponent, {
          panelClass: ['no-padding'],
          data: {
            containerWidth: '1000px',
            headerText: `Pr Number: ${prno.value}`,
            prNumber: prno.value,
          }
        });

        setTimeout(() => {
          this.clearAddPRForm();
        }, 500);

      }

    });

     /* prno.value = "";
      datecreated.value = "";
      requestor.value = "";
      designation.value = "";
      division.value = "Administrative Services";
      purpose.value = "";
      prstatus.value = "For Approve";*/
  }

  async getAllData(division:string) {
      try {
        await this.employee.getEmp(division).toPromise().then((res:any) => {
          this.options = res;

          this.filteredOptions = this.addForm.get("pr_requestor").valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
        });

      } catch (error) {
        console.error(error);
      }
  }

}
