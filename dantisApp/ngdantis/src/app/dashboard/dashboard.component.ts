import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../register.service';
import { ProductService } from '../product.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('editModal') editModal : TemplateRef<any>;
  dashObj = {
    isAdmin: true
  };

  productForm = this.fb.group({
    productName: new FormControl(''),
    quantity: new FormControl(''),
    reOrderQuantity: new FormControl(''),
    price: new FormControl('')
  })
  productsList;

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private regService: RegisterService,
    private toastr: ToastrService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.getproductsList();
  }

  addNew() {
    this.modalService.open(this.editModal);
  }

  onProductSubmit(){
    this.modalService.dismissAll();
    this.regService.postpProduct(this.productForm.value).subscribe((res: any) => {
      if(res.success) {
        this.showSuccess();
      } else {
        this.toastr.error('Dantis Could not add this product!','Failed!',{ progressBar: true } );
      }
      this.productForm.reset();
      this.getproductsList();
    });
  }

  getproductsList(){
    this.productService.getProductsList().subscribe(res =>{
      this.productsList = res;
    });
  }

  showSuccess() {
    this.toastr.success('Dantis added your Product!','Success!',{ progressBar: true } );
  }
}
