import { Component, OnInit, ViewChild } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { analyzeAndValidateNgModules } from '@angular/compiler';
//import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-pr-add',
  templateUrl: 'pr-add.component.html',
  styleUrls: ['pr-add.component.scss']
})


export class PrAddComponent implements OnInit {
  public dataSource:any;
  public result:any;
  //public displayedColumns = ['PRNo','DateCreated','Requestor','Designation','Division','Purpose','PRStatus'];
  public prload;
  public prNumber:any;
  public units:any;
  public divisions:any;

  date1 = new FormControl(new Date())

  public fieldArray: Array<any> = [];
  public newAttribute: any = {};

  name = new FormControl('');

  posts: any;
  //name1 = 'Angular';

  productForm: FormGroup;

  myControl = new FormControl('');
  options: any[];
  filteredOptions: Observable<string[]>;

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  constructor(private document:PrService, private fb:FormBuilder) {
    this.productForm = this.fb.group({
      quantities: this.fb.array([]) ,
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.document.loadPRNo()
    .subscribe(data => {
      this.result = data;
      //console.log(this.result)
    });

    this.dataSource = new MatTableDataSource(this.result);

    this.onDisplayUnitMeasurements();
    this.onDisplayDivisions();
    this.getAllData();
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
      //console.log(data);
    });

     /* prno.value = "";
      datecreated.value = "";
      requestor.value = "";
      designation.value = "";
      division.value = "Administrative Services";
      purpose.value = "";
      prstatus.value = "For Approve";*/
  }

  getAllData(){
    this.document.getEmp().subscribe((res:any) => {
      this.options = res
      console.log(this.options);
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  
}
