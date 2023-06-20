import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrService } from '../../../services/pr.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../../services/session-storage.service';
import { NotificationsService } from '../../../services/notifications.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public statusColor:string;
  public cancel_pr: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<ConfirmationComponent>,
    private pr: PrService,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService,
    private websock: WebSocketService
  ) { }

  ngOnInit(): void {
    this.cancel_pr = new FormGroup({
      cancel_remarks: new FormControl(null, Validators.required),
    });
  }

  onConfirm(pr_num:string) {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['statusSuccess']
    };

    if (this.cancel_pr.valid === true) {
      const { cancel_remarks } = this.cancel_pr.value;

      let params = new FormData();
      params.append('prno', pr_num);
      params.append('remarks', cancel_remarks);
      params.append('pr_status', this.data.pr_status);

      this.pr.cancelPR(params)
      .subscribe(data => {
        let result:any = data;
        if (result.status === "Success") {
          this.statusColor = 'statusSuccess';

          let title = `Purchase Request ${this.data.pr_status}`;
          let message = `Purchase Request: ${pr_num} has been ${this.data.pr_status} by ${this.sessionStorageService.getSession('username')}`;


          this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), this.sessionStorageService.getSession('division'), this.data.pr_status, pr_num).subscribe(data => {
            //this.websock.status_message = devicedeveui;
            console.log(data);
          });

          this.websock.sendNotif(message);
          this.websock.updateNotification();
          this.websock.updatePRTable();

        } else {
          this.statusColor = 'statusFailed';
        }
        config.panelClass = [this.statusColor];
        this.snackBar.open(result.status, 'Close', config);
        this.dialogRef.close('yes');
      });
    } else {
      this.statusColor = 'statusFailed';
    }
    config.panelClass = [this.statusColor];
    this.snackBar.open('Please input necessary details', 'Close', config);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
