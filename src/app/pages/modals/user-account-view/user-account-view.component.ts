import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PrService } from '../../../services/pr.service';
import { EmployeeService } from '../../../services/employee.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-account-view',
  templateUrl: './user-account-view.component.html',
  styleUrls: ['./user-account-view.component.scss']
})
export class UserAccountViewComponent implements OnInit {

  public isVisible:boolean;

  public editForm: FormGroup;
  filteredOptions: any;
  options: any;

  public isAutoFill:boolean = false;
  public divisions:any;
  public accesses:any;

  public displayedColumns = ['Empid', 'Username', 'Fullname', 'Email', 'Division', 'Designation', 'Access'];

  //private empID:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public user:UserService,
    private pr:PrService,
    private employee:EmployeeService,
    private dialogRef:MatDialogRef<UserAccountViewComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Username: new FormControl('',[Validators.required]),
      Password: new FormControl('', [Validators.required]),
      FullName: new FormControl('', [Validators.required]),
      Division: new FormControl('', [Validators.required]),
      Designation: new FormControl('', [Validators.required]),
      email: new FormControl(''),
    });

    if (this.data.isFormDisabled) {
      this.editForm.disable();
      this.isVisible = false;
    } else {
      this.editForm.enable();
      this.isVisible = true;
    }

    this.loadUserAccounts(this.data.user_id);
    this.loadDivisions();
    this.loadAccess();

    this.getAllData();
  }

  onOptionSelected(event: any) {

    const selectedValue = event.option.value;

    this.employee.selectEmployee(selectedValue)
    .subscribe(data => {
      let result:any = data;
      this.editForm.get('Division').setValue(result[0].division);
      this.editForm.get('Designation').setValue(result[0].designation);
      //this.designation.setValue(result[0].designation);
    });
    // Update the other field with the selected value
    // this.otherControl.setValue(selectedValue);
  }

  loadUserAccounts(userid) {
    //this.empID = userid;
    this.user.fetchOneUserAccount(userid)
    .subscribe(data => {
      let result:any = data;
      this.editForm.patchValue(result[0]);
      // this.editForm.setValue({
      //   empid: result[0].Emp_ID,
      //   username: result[0].Username,
      //   fullname: result[0].FullName,
      //   email: result[0].email,
      //   division: result[0].Division.toUpperCase(),
      //   designation: result[0].Designation,
      //   access: result[0].Access,
      // });
      //this.pr_items = result;

    });
  }

  onSaveUserAccount() {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['style-snackbar-success']
    };

    this.user.editUserAccount(this.editForm.value)
    .subscribe(data => {
      let res:any = data;
      if (res.status === "Account updated successfully") {
        console.log(res.status);
        this.user.fetchAllUserAccounts()
        .subscribe(data => {
          let res:any = data;
          if (this.user.dataSourceUser !== undefined && this.user.dataSourceUser !== null) {
            this.user.dataSourceUser.data = res;
          }
        });

      } else {
        config.panelClass = ['style-snackbar-error'];
      }
      setTimeout(() => {
        this.dialogRef.close();
        this.snackBar.open(res.status, 'Dismiss', config);
      }, 1000);
    });
  }

  loadDivisions() {
    this.pr.getDivisions()
    .subscribe(data => {
      this.divisions = data;
    });
  }

  loadAccess() {
    this.user.fetchAccess()
    .subscribe(data => {
      this.accesses = data;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.full_name.toLowerCase().includes(filterValue));
  }

  async getAllData() {
    try {
      await this.employee.getEmp("All").toPromise().then((res:any) => {
        this.options = res;
        this.filteredOptions = this.editForm.get("FullName").valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      });

    } catch (error) {
      console.error(error);
    }
  }

}
