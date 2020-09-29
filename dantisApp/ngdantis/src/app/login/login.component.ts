import { Component } from '@angular/core';
import { RegisterService } from '../register.service'
import { DataServiceService } from '../data-service.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'ngdantis';
  loginShow: boolean = false;
  registerShow: boolean = false;
  isLoading;

  loginForm = this.fb.group({
    userName: new FormControl(''),
    password: new FormControl(''),
    registerForm: this.fb.group({
      userName: new FormControl(''),
      password: new FormControl(''),
      phoneNumber: new FormControl('')
    })
  });

  constructor(private regService: RegisterService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataServiceService) {

  }
  ngOnInit() {
    this.loginShow = true;
    this.registerShow = false;

  }

  registerNow() {
    this.registerShow = true;
    this.loginShow = false;

  }

  onRegSubmit() {
    this.isLoading = true;
    if (this.loginForm.value.userName != null) {
      this.regService.authenticateUser(this.loginForm.value.userName, this.loginForm.value.password).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Dantis got You!, You are Welcome ' + res.message, 'Success!', { progressBar: true });
          this.router.navigate(['/dash']);
          this.dataService.logedInUserDetail.userId = res.id;
          this.dataService.logedInUserDetail.userName = res.message;
        } else {
          this.toastr.error('Dantis Could not recognize you!', 'Please Register!', { progressBar: true });
        }
        this.isLoading = false;
      });
      this.loginForm.reset();
    } else {
      if (this.loginForm.value.registerForm.userName != "" || this.loginForm.value.registerForm.userName != null)
        this.registerUser();
    }

  }

  onBlurName() {
    this.regService.isUnameExists(this.loginForm.value.registerForm.userName).subscribe((res: any) => {
      if (!res.success) {
        this.toastr.warning('Dantis suggests some other name', 'User exists!', { progressBar: true });
      }
    });
  }

  registerUser() {
    this.regService.postRegisterUser(this.loginForm.value.registerForm).subscribe((res: any) => {
      if (res.success) {
        this.showSuccess();
      } else {
        this.toastr.error('Dantis Could not register You!', 'Failed!', { progressBar: true });
      }
      this.loginForm.get('registerForm').reset();
      this.loginShow = true;
      this.registerShow = false;

    });
  }

  showSuccess() {
    this.toastr.success('Dantis registered You!', 'Success!', { progressBar: true });
  }
}
