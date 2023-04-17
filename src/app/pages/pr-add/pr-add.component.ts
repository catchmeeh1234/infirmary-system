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

  date1 = new FormControl(new Date());

  requestor = new FormControl('');

  public fieldArray: Array<any> = [];
  public newAttribute: any = {};

  name = new FormControl('');

  posts: any;
  //name1 = 'Angular';

  productForm: FormGroup;

  addForm = new FormGroup({
    requestor: new FormControl()
  });
  options: any;
  //options: any = [{"division_id":"1","division_name":"Administrative Services"},{"division_id":"2","division_name":"Engineering and Maintenance"},{"division_id":"3","division_name":"Finance and Commercial"},{"division_id":"4","division_name":"Production"}];
  filteredOptions: any;

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  constructor(
    private document:PrService,
    private fb:FormBuilder,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService,
    public websock: WebSocketService
  ) {
    this.productForm = this.fb.group({
      quantities: this.fb.array([]) ,
    });
  }

  ngOnInit(): void {

    this.document.loadPRNo()
    .subscribe(data => {
      this.websock.response = data;
      //console.log(this.result)
    });

    this.dataSource = new MatTableDataSource(this.websock.response);

    this.onDisplayUnitMeasurements();
    this.onDisplayDivisions();
    this.getAllData();

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.full_name.toLowerCase().includes(filterValue));
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

  quantities() : FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      qty: ['', [Validators.required,  Validators.pattern('^[0-9]*$')]],
      unit: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],

    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }

  openStatusMessage() {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 0,
      panelClass: ['style-snackbar']
    };
    //this.snackBar.openFromComponent(StatusMessageComponent, config);
  }

  clearAddPRForm() {
    let requestor = <HTMLInputElement>document.querySelector('.requestor');
    let designation = <HTMLInputElement>document.querySelector('.designation');
    let purpose = <HTMLInputElement>document.querySelector('.purpose');

    this.productForm.reset();
    requestor.value = '';
    designation.value = '';
    purpose.value = '';
  }



  addPurchaseRequest() {
    let prno = <HTMLInputElement>document.querySelector('.prno');
    let datecreated = <HTMLInputElement>document.querySelector('.datecreated');
    let requestor = <HTMLInputElement>document.querySelector('.requestor');
    let designation = <HTMLInputElement>document.querySelector('.designation');
    let division = <HTMLInputElement>document.querySelector('.division');
    let purpose = <HTMLInputElement>document.querySelector('.purpose');
    let prstatus = <HTMLInputElement>document.querySelector('.prstatus');

    // let items = <HTMLInputElement>document.querySelector('.items');
    // let quantity = <HTMLInputElement>document.querySelector('.quantity');
    // let unit = <HTMLInputElement>document.querySelector('.unit');
    // let cost = <HTMLInputElement>document.querySelector('.cost');

    if (!this.productForm.valid || prno.value == "" || purpose.value == "" || requestor.value == "" || designation.value == "") {
      this.openStatusMessage();
      return;
    }

    var username = sessionStorage.getItem('fullname')
    // if (prno.value == "" || purpose.value == "" || requestor.value == "" || designation.value == "") {
    //   return;
    // }



    //let x = this.document.addPR(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value);
    let x = this.document.addPR(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value, this.productForm.value, username);
    //console.log(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value, this.productForm.value);
    //console.log(prno.value, datecreated.value, requestor.value, designation.value, division.value, purpose.value, prstatus.value)

    x.subscribe(data => {
      let response:any = data;
      if (response === "Inserted Successfully") {
        let title = 'Purchase Request Created';
        let message = `Purchase Request: ${prno.value} has been created by ${this.sessionStorageService.getSession('username')}`;


        this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), division.value, prstatus.value, prno.value).subscribe(data => {
          //this.websock.status_message = devicedeveui;
          console.log(data);
        });

        this.websock.sendNotif(message);
        this.websock.updateNotification();
        this.clearAddPRForm();
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

  async getAllData() {
      try {
        await this.document.getEmp().toPromise().then((res:any) => {
          this.options = res;

          this.filteredOptions = this.requestor.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );

        });

      } catch (error) {
        console.error(error);
      }
  }

}
