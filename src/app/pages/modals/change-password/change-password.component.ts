import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private user:UserService,
    private snackBar:MatSnackBar,
    private dialogRef:MatDialogRef<ChangePasswordComponent>,
    ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      confirmnewpassword: ['' , Validators.required],
    });
  }

  changePassword() {
    if (!this.changePasswordForm.valid) {
      return;
    }
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['style-snackbar-success']
    };

    if (this.changePasswordForm.value.newpassword === this.changePasswordForm.value.confirmnewpassword) {
      let message:string;
      this.user.changeUserPassword(this.changePasswordForm.value, this.data.id)
      .subscribe((res:any) => {
        if (res.status === "success") {
          message = "Password Updated";
          this.dialogRef.close();
        } else {
          config.panelClass = ['style-snackbar-error'];
          message = "Error/Incorrect Password";
        }
        this.snackBar.open(message, 'Dismiss', config);
      });
    } else {
      config.panelClass = ['style-snackbar-error'];
      this.snackBar.open('Password does not match', 'Dismiss', config);
    }

  }
}
