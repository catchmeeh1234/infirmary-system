import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PrService } from '../../../services/pr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeService } from '../../../services/employee.service';
import {map, startWith} from 'rxjs/operators';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SessionStorageService } from '../../../services/session-storage.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pr-edit',
  templateUrl: './pr-edit.component.html',
  styleUrls: ['./pr-edit.component.scss']
})
export class PrEditComponent implements OnInit {
  public editForm: FormGroup;
  filteredOptions: any;
  options: any;

  public divisions:any;
  public units:any;
  public pr_items:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pr: PrService,
    private formBuilder:FormBuilder,
    private dialogRef:MatDialogRef<PrEditComponent>,
    private employee:EmployeeService,
    public dialog: MatDialog,
    private sessionStorageService:SessionStorageService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      prDetails_id: ['', Validators.required],
      pr_no: ['', Validators.required],
      pr_no_hidden: ['', Validators.required],
      pr_requestor: ['', Validators.required],
      pr_designation: ['', Validators.required],
      pr_division: ['', Validators.required],
      pr_purpose: ['', Validators.required],
      remarks: [''],
      items: this.formBuilder.array([]),
      pr_title: [''],
    });

    this.editForm.get('pr_no')?.disable();
    this.editForm.get('pr_designation')?.disable();
    this.editForm.get('pr_division')?.disable();

    this.displayDivisions();
    this.displayUnits();
    this.getAllData();

    // Initialize the form with the JSON data
    this.pr.loadPrAndItems(this.data.number)
    .subscribe((res:any) => {
        this.setFormValues(res);
    });
  }
  //functions for items

  //add items dynamically
  addItem() {
    //this.quantities().push(this.newQuantity());
    this.itemFormArray.push(this.createItemGroup(null));
    // const newRow = { pr_items: "", pr_quantity: "", pr_cost: "", pr_unit: "" };
    // this.pr_items.push(newRow);

    // this.displayPRItems(this.pr_items);
  }

  //remove items dynamically
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

  createItemGroup(item:any): FormGroup {

    return this.formBuilder.group({
      boldText: [item ? item.bold_text : null],
      prItems_id: [item ? item.prItems_id:null],
      item: [item ? item.pr_items: null, Validators.required],
      qty: [item ? item.pr_quantity: null, [Validators.required,  Validators.pattern('^[0-9]*$')]],
      cost: [item ? item.pr_cost: null, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      unit: [item ? item.pr_unit: null, Validators.required],
      pr_subitems: this.formBuilder.array([]),
    });
  }

  // Set up the FormArray with sub-items
  setItems(items: any[]): void {
    for (let [index, item] of items.entries()) {
      //bold text
      if (item.bold_text === "true") {
        item.bold_text = true;
      } else {
        item.bold_text = false;
      }

      this.itemFormArray.push(this.createItemGroup(item));
      //this.setSubItems(data.pr_subitems); // Set the sub-items in the FormArray
      for (const subitem of item.pr_subitems) {
        //console.log(subitem);
        this.subItemFormArray(index).push(this.createSubItemFormGroup(subitem));
      }
    }

  }

  // Helper method to get the item FormArray
  get itemFormArray(): FormArray {
    return this.editForm.get('items') as FormArray;
  }

  //functions for subitem
  addSubItem(i:number) {
    this.subItemFormArray(i).push(this.createSubItemFormGroup(null));
  }

  removeSubItem(i:number, z:number) {
    this.subItemFormArray(i).removeAt(z);
  }

 // Helper method to get the item FormArray
  subItemFormArray(index: number): FormArray {
    return this.itemFormArray.at(index).get('pr_subitems') as FormArray;
  }

  // Helper method to create sub-item form controls
  createSubItemFormGroup(subitem: any): FormGroup {
    return this.formBuilder.group({
      //dprItems_id: [subitem.dprItems_id],
      //prItems_id: [subitem.prItems_id],
      dpr_items: [subitem ? subitem.dpr_items: null, Validators.required],
      dpr_quantity: [subitem ? subitem.dpr_quantity : null, [Validators.required,  Validators.pattern('^[0-9]*$')]],
      dpr_cost: [subitem ? subitem.dpr_cost: null, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      dpr_unit: [subitem ? subitem.dpr_unit: null, Validators.required],
    });
  }


  // Set up the entire form with main details and sub-items
  setFormValues(data: any): void {
    for (const res of data) {
      this.editForm.patchValue(res); // Patch the main details to the form
      this.editForm.patchValue({ pr_no_hidden: res.pr_no });
      this.setItems(res.items);
    }
    console.log(this.editForm.value);
  }


  displayDivisions() {
    this.pr.getDivisions()
    .subscribe(res => {
      let result:any = res;

      this.divisions = result;
    });
  }

  displayUnits() {
    this.pr.getUnitMeasurements()
    .subscribe( res => {
      let result:any = res;
      this.units = result;
    });
  }

  onOptionSelected(event: any) {

    const selectedValue = event.option.value;

    this.employee.selectEmployee(selectedValue)
    .subscribe(data => {
      let result:any = data;
      this.editForm.get('pr_division').setValue(result[0].division);
      this.editForm.get('pr_designation').setValue(result[0].designation);
      //this.designation.setValue(result[0].designation);
    });
    // Update the other field with the selected value
    // this.otherControl.setValue(selectedValue);
  }

  onSavePR() {
    console.log(this.editForm.value);
    this.editForm.get('pr_no')?.enable();
    this.editForm.get('pr_designation')?.enable();
    this.editForm.get('pr_division')?.enable();
    this.pr.editPR(this.editForm.value)
    .subscribe(data => {
      console.log(data);
      this.pr.loadPR()
      .subscribe(data => {
        let res:any = data;
        if (this.pr.dataSourcePRTable !== undefined && this.pr.dataSourcePRTable !== null) {
          this.pr.dataSourcePRTable.data = res;
        }

        this.editForm.get('pr_no')?.disable();
        this.editForm.get('pr_designation')?.disable();
        this.editForm.get('pr_division')?.disable();

        setTimeout(() => {
          this.dialogRef.close(this.editForm.get('pr_no')?.value);
          const config: MatSnackBarConfig = {
            verticalPosition: 'top',
            duration: 5000,
            panelClass: ['style-snackbar-success']
          };
          this.snackBar.open('PR Updated Successfully', 'Dismiss', config);
        }, 1000);
      });
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.full_name.toLowerCase().includes(filterValue));
  }

  async getAllData() {
    try {
      await this.employee.getEmp(this.sessionStorageService.getSession("division")).toPromise().then((res:any) => {
        this.options = res;

        this.filteredOptions = this.editForm.get("pr_requestor").valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      });

    } catch (error) {
      console.error(error);
    }
  }

}
