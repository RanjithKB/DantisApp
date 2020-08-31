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
  
  @ViewChild('editModal') editModal : TemplateRef<any>;

  userForm = this.fb.group({
    userName: new FormControl(''),
    password: new FormControl(''),
    phoneNumber: new FormControl(''),
    superAdmin: new FormControl('')
  })

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private regService: RegisterService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
   

  }

  addNew() {
    this.modalService.open(this.editModal);
  }

  onUserSubmit(){
    this.modalService.dismissAll();
    this.regService.postRegisterUser(this.userForm.value).subscribe((res: any) => {
      if(res.success) {
        this.showSuccess();
      } else {
        this.toastr.error('Dantis Could not register You!','Failed!',{ progressBar: true } );
      }
      this.userForm.reset();
      
    });
  }

  showSuccess() {
    this.toastr.success('Dantis registered You!','Success!',{ progressBar: true } );
  }

}
