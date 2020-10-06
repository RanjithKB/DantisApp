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

  @ViewChild('editModal') editModal: TemplateRef<any>;
  dashObj = {
    isAdmin: true
  };
  productCode: string;
  productName: string;


  productForm = this.fb.group({
    productName: new FormControl(''),
    productCode: new FormControl(''),
    quantity: new FormControl(''),
    reOrderQuantity: new FormControl(''),
    price: new FormControl(''),
    category: new FormControl(''),
    brandName: new FormControl(''),
    dealer: new FormControl(''),
    taxId: new FormControl('')
  });
  productsList;
  producHeader: string;
  brand: string;
  buttonName: string;
  currentProductId;
  taxList = [];
  masterProductList;

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private regService: RegisterService,
    private toastr: ToastrService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.getproductsList();
    this.getTaxList();
  }

  addNew() {
    this.productForm.reset();
    this.modalService.open(this.editModal);
    this.producHeader = "New Product";
    this.brand = "New Arrival!";
    this.buttonName = "Save";
    this.currentProductId = "0";
    this.productForm.patchValue({
      taxId: 0
    });
  }

  onProductSubmit() {
    this.modalService.dismissAll();
    if (this.currentProductId == "0") {
      this.regService.postpProduct(this.productForm.value).subscribe((res: any) => {
        if (res.success) {
          this.showSuccess();
        } else {
          this.toastr.error('Dantis Could not add this product!', 'Failed!', { progressBar: true });
        }
        this.productForm.reset();
        this.getproductsList();
      }, err => {
        this.toastr.warning('Dantis Could not update this product!', 'Please try agaiin!', { progressBar: true });
      });
    } else {
      let updateModel = this.productForm.value;
      updateModel.id = this.currentProductId;
      this.productService.updateProduct(updateModel).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Dantis Updated your Product!', 'Success!', { progressBar: true });
        } else {
          this.toastr.error('Dantis Could not update this product!', 'Failed!', { progressBar: true });
        }
        this.productForm.reset();
        this.getproductsList();
      }, err => {
        this.toastr.warning('Dantis Could not update this product!', 'Please try agaiin!', { progressBar: true });
      });
    }

  }

  getproductsList() {
    this.productService.getProductsList().subscribe(res => {
      this.productsList = JSON.parse(JSON.stringify(res));
      this.masterProductList = JSON.parse(JSON.stringify(res));
    });
  }

  getTaxList() {
    this.productService.getTaxList().subscribe(res => {
      this.taxList = res;
      let obj = {
        "_id": 0,
        "Name": "Select",
        "Value": 0
      }
      this.taxList.unshift(obj);
    });
  }

  getproductsDetails(id) {
    this.productService.getproductdetails(id).subscribe(res => {
      this.productForm.patchValue({
        productName: res.productName,
        productCode: res.productCode,
        quantity: res.quantity,
        reOrderQuantity: res.reOrderQuantity,
        price: res.price,
        category: res.category,
        brandName: res.brandName,
        dealer: res.dealer,
        taxId: res.taxId
      });
      this.currentProductId = id;
    });
  }

  showSuccess() {
    this.toastr.success('Dantis added your Product!', 'Success!', { progressBar: true });
  }

  rowClick(id) {
    this.modalService.open(this.editModal);
    this.getproductsDetails(id);
    this.producHeader = this.productsList.find(o => o._id == id).productName;
    this.brand = this.productsList.find(o => o._id == id).brandName;
    this.buttonName = "Update";
  }

  onProductDelete() {
    this.productService.deleteproduct(this.currentProductId).subscribe(res => {
      if (res.success) {
        this.toastr.success('Dantis deleted  product that you are requested!', 'Success!', { progressBar: true });
      } else {
        this.toastr.warning('Dantis could not  delete  product that you are requested!', 'Please Try again!', { progressBar: true });
      }
      this.productForm.reset();
      this.getproductsList();
      this.modalService.dismissAll();
    }, err => {
      this.toastr.warning('Dantis could not  delete  product that you are requested!', 'Please Try again!', { progressBar: true });
    });
  }

  searchCode(event) {
    if (event == "") {
      this.productsList = this.masterProductList;
    } else {
      this.productsList = this.productsList.filter((ele) => {
        return ele.productCode.toLowerCase().includes(event.toLowerCase());
      })
    }
  }

  searchName(event) {
    if (event == "") {
      this.productsList = this.masterProductList;
    } else {
      this.productsList = this.productsList.filter((ele) => {
        return ele.productName.toLowerCase().includes(event.toLowerCase());
      })
    }
  }

  clearNameBox() {
    this.productsList = this.masterProductList;
    this.productName = "";
  }

  clearBox() {
    this.productsList = this.masterProductList;
    this.productCode = "";
  }
}
