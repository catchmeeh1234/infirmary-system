import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  @ViewChild('inputusername') inputusername: ElementRef;

  private statusMessage:any;

  userForm: FormGroup;
  formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required': 'Please enter your username',
      'email': 'please enter your username'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    }
  };

  constructor(private router: Router,
              private fb: FormBuilder, private user:UserService, private sessionStorageService:SessionStorageService) {
  }

  ngOnInit() {

    const userid:any = this.sessionStorageService.getSession("userid");
    if (userid !== null) {
      this.router.navigate(['auth/dashboard'], { queryParams: { id: userid } });
    } else {
      this.router.navigate(['/login']);
    }

    this.buildForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputusername.nativeElement.focus();
    }, 0);
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
          Validators.required
        ]
      ],
      'password': ['', [
          //Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          //Validators.minLength(6),
          Validators.maxLength(25)
        ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    // if (!this.userForm) {
    //   return;
    // }
    // const form = this.userForm;
    // for (const field in this.formErrors) {
    //   if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
    //     this.formErrors[field] = '';
    //     const control = form.get(field);
    //     if (control && control.dirty && !control.valid) {
    //       const messages = this.validationMessages[field];
    //       for (const key in control.errors) {
    //         if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
    //           this.formErrors[field] += messages[key] + ' ';
    //         }
    //       }
    //     }
    //   }
    // }
  }
  login() {
    const username = this.userForm.value.email;
    const password = this.userForm.value.password;

    this.user.getUser(username, password).subscribe(
      data => {
        this.statusMessage = data;

        if (this.statusMessage.status === "Invalid Credentials") {
            //this.router.navigate(['/login']);
            this.formErrors.password = this.statusMessage.status;

        } else {
          this.sessionStorageService.setSession('userid', this.statusMessage.uid);
          this.sessionStorageService.setSession('username', this.statusMessage.username);
          this.sessionStorageService.setSession('fullname', this.statusMessage.fullname);
          this.sessionStorageService.setSession('division', this.statusMessage.division);
          this.sessionStorageService.setSession('access', this.statusMessage.access);
          //this.router.navigate(['/auth/dashboard'], { queryParams: { id: this.sessionStorageService.getSession('userid') } });
          this.router.navigate(['/auth/dashboard'], { queryParams: { role: this.sessionStorageService.getSession('division') } });
        }
      }
    );
  }
}

