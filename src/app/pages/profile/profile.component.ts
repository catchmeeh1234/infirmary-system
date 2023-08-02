import { Component, OnInit } from '@angular/core';
import { PrService } from '../../services/pr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from '../../services/session-storage.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public divisions:any;
  private userid = this.sessionStorageService.getSession("userid");

  public profileForm:FormGroup;
  public btnValue:string = "Edit";

  constructor(private pr:PrService,
              private sessionStorageService:SessionStorageService,
              private user:UserService,
              private formBuilder:FormBuilder,
              private router:Router) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      id: ['', Validators.required],
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      FullName: ['', Validators.required],
      Division: ['', Validators.required],
      Designation: ['', Validators.required],
      email: [''],
    });

    this.loadDivisions();
    this.loadProfile();
  }

  loadDivisions() {
    this.pr.getDivisions()
    .subscribe((data:any) => {
      this.divisions = data;
    });
  }

  loadProfile() {
    this.user.fetchOneUserAccount(this.userid)
    .subscribe((data:any) => {
      this.profileForm.patchValue(data[0]);
      this.profileForm.disable();
    });
  }

  onEditUserAccount() {
    if (this.btnValue === "Edit") {
      this.btnValue = "Save";
      this.profileForm.enable();
    } else  {
      this.btnValue = "Edit";

      this.user.editUserAccount(this.profileForm.value)
      .subscribe((data:any) => {
        if (data.status === "Account updated successfully") {
          alert("Account Update was Successful, Please log in again");
          this.router.navigate(['./login']);
          this.sessionStorageService.removeSession();
        } else {
          alert(data.status);
        }
        this.profileForm.disable();

      });

    }

  }

}
