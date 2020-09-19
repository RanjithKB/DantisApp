import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl } from '@angular/forms';
import { RegisterService } from 'src/app/register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild('editModal') editModal: TemplateRef<any>;
  dashObj = {
    isAdmin: true
  };

  userForm = this.fb.group({
    userName: new FormControl(''),
    password: new FormControl(''),
    phoneNumber: new FormControl(''),
    superAdmin: new FormControl('')
  })
  usersList;
  producHeader: string;
  brand: string;
  buttonName: string;
  currentUserId: any;

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private regService: RegisterService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getUserList();

  }

  addNew() {
    this.modalService.open(this.editModal);
    this.producHeader = 'New User';
    this.brand = 'New Staff!';
    this.buttonName = "Save";
    this.currentUserId = "0";
  }

  onUserSubmit() {
    this.modalService.dismissAll();
    if (this.currentUserId == "0") {
      this.regService.postRegisterUser(this.userForm.value).subscribe((res: any) => {
        if (res.success) {
          this.showSuccess();
        } else {
          this.toastr.error('Dantis Could not register You!', 'Failed!', { progressBar: true });
        }
        this.userForm.reset();
        this.getUserList();
      });
    } else {
      let updateModel = this.userForm.value;
      updateModel.id = this.currentUserId;
      this.regService.updateUser(updateModel).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Dantis Updated User!', 'Success!', { progressBar: true });
        } else {
          this.toastr.error('Dantis Could not update user!', 'Failed!', { progressBar: true });
        }
        this.userForm.reset();
        this.getUserList();
      }, err => {
        this.toastr.warning('Dantis Could not update user!', 'Please try agaiin!', { progressBar: true });
      });
    }
  }

  getUserList() {
    this.regService.getUsersList().subscribe(res => {
      this.usersList = res;
    });
  }

  showSuccess() {
    this.toastr.success('Dantis registered You!', 'Success!', { progressBar: true });
  }

  rowClick(id) {
    this.modalService.open(this.editModal);
    this.getUserDetails(id);
    this.producHeader = this.usersList.find(o => o._id == id).userName;
    this.brand = this.usersList.find(o => o._id == id).superAdmin == true ? 'Super Admin' : 'Staff';
    this.buttonName = "Update";
  }

  getUserDetails(id) {
    this.regService.getUserdetails(id).subscribe(res => {
      this.userForm.patchValue({
        userName: res.userName,
        password: res.password,
        phoneNumber: res.phoneNumber,
        superAdmin: res.superAdmin,
      });
      this.currentUserId = id;
    });
  }

  onUserDelete() {
    this.regService.deleteUser(this.currentUserId).subscribe(res => {
      if (res.success) {
        this.toastr.success('Dantis deleted  User that you are requested!', 'Success!', { progressBar: true });
      } else {
        this.toastr.warning('Dantis could not  delete  User that you are requested!', 'Please Try again!', { progressBar: true });
      }
      this.userForm.reset();
      this.getUserList();
      this.modalService.dismissAll();
    }, err => {
      this.toastr.warning('Dantis could not  delete  user that you are requested!', 'Please Try again!', { progressBar: true });
    });
  }

}
