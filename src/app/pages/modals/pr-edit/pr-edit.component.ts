import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PrService } from '../../../services/pr.service';

@Component({
  selector: 'app-pr-edit',
  templateUrl: './pr-edit.component.html',
  styleUrls: ['./pr-edit.component.scss']
})
export class PrEditComponent implements OnInit {
  public editForm: FormGroup;
  filteredOptions: any;

  public divisions:any;
  public units:any;
  public pr_items:any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pr:PrService,
  ) {
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      pr_number: new FormControl('',[Validators.required]),
      requestor: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      division: new FormControl('', [Validators.required]),
      purpose: new FormControl('', [Validators.required]),
      cancel_remarks: new FormControl('', [Validators.required]),

    });
    this.displayDivisions();
    this.displayUnits();
    this.displayPrAndItems();
  }

  displayPrAndItems() {
    this.pr.loadPrAndItems(this.data.number)
    .subscribe(res => {
      let result:any = res;

      this.editForm.setValue({
        pr_number: result[0].pr_no,
        requestor: result[0].pr_requestor,
        designation: result[0].pr_designation,
        division: result[0].pr_division,
        purpose: result[0].pr_purpose,
        cancel_remarks: result[0].remarks,
      });

      this.pr_items = result;
    });
  }

  displayDivisions() {
    this.pr.getDivisions()
    .subscribe(res => {
      let result:any = res;
      console.log(result);

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

  addQuantity() {
    //this.quantities().push(this.newQuantity());
    const newRow = { pr_items: "", pr_quantity: "", pr_cost: "", pr_unit: "" };
    this.pr_items.push(newRow);
    console.log(this.pr_items);

  }

  removeQuantity(row) {
    const index = this.pr_items.indexOf(row);
    if (index > -1) {
      this.pr_items.splice(index, 1);
    }
  }

  onOptionSelected(event: any) {
    // const selectedValue = event.option.value;

    // this.employee.selectEmployee(selectedValue)
    // .subscribe(data => {
    //   let result:any = data;
    //   this.addForm.get('division').setValue(result[0].division);
    //   this.addForm.get('designation').setValue(result[0].designation);
    //   //this.designation.setValue(result[0].designation);
    // });
    // Update the other field with the selected value
    // this.otherControl.setValue(selectedValue);
  }

}
