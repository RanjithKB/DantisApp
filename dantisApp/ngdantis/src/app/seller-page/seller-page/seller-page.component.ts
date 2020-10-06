import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProductService } from './../../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IfStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-seller-page',
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']
})
export class SellerPageComponent implements OnInit {
  productsList;
  saleObj = {
    isAdmin: false
  };
  cartCount: number = 0;
  cartItems = [];
  invoice: boolean;
  invoiceProducts = [];
  fName: string;
  lName: string;
  address: string;
  email: string;
  phone: number;
  billingInfo: boolean = true;
  paymentModes = [];
  grandTotal: number = 0;
  paidTotal: number = 0;
  productCode: string;
  masterProductList;

  @ViewChild('cartModal') cartModal: TemplateRef<any>;


  constructor(private productService: ProductService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getproductsList();
    this.billingInfo = true;
    this.getPaymentModes();
  }

  getproductsList() {
    this.productService.getProductsList().subscribe(res => {
      this.productsList = JSON.parse(JSON.stringify(res));
      this.masterProductList = JSON.parse(JSON.stringify(res));
      this.masterProductList.map(ele => {
        ele['select'] = false;
        ele['qtyRequired'] = 0;
        ele['disableDecrease'] = true;
        ele['disableIncrease'] = false;
      })
      this.productsList.map(ele => {
        ele['select'] = false;
        ele['qtyRequired'] = 0;
        ele['disableDecrease'] = true;
        ele['disableIncrease'] = false;
      })
    });
  }

  selectProduct(eve, id) {
    if (eve.target.checked) {
      this.productsList.find(o => o._id == id).select = true;
    } else {
      this.productsList.find(o => o._id == id).select = false;
    }
    this.cartCount = this.productsList.filter(o => o.select == true).length;
  }

  openCart() {
    this.cartItems = [];
    this.productsList.map(ele => {
      if (ele.select) {
        let taxValue = this.getTaxValue(ele.taxId);
        ele['TaxPrice'] = this.calculatePercentage(taxValue, ele.price);
        this.cartItems.push(ele);
      }
    });
    this.modalService.open(this.cartModal, { size: 'lg', backdrop: 'static' });
    console.log('dds', this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cartCount = 0;
    this.billingInfo = true;
    this.productsList.map(ele => {
      ele.select = false;
      ele.qtyRequired = 0;
      ele.disableDecrease = true;
    });
    this.fName = "";
    this.lName = "";
    this.address = "";
    this.email = "";
    this.phone = null;
    this.modalService.dismissAll();
  }

  removeItem(id) {
    let index = this.cartItems.findIndex(o => o._id == id);
    let indexProduct = this.productsList.findIndex(o => o._id == id);
    this.productsList[indexProduct].select = false;
    this.cartItems.splice(index, 1);
    this.cartCount = this.cartItems.length;
    this.paidTotal = this.grandTotal = this.cartItems.reduce((sum, p) => sum + (p.qtyRequired * (p.price + p.TaxPrice)), 0);
    this.billingInfo = true;
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  insertInvoiceInfo() {
    let objArray = [];
    let billNo = new Date().valueOf();
    this.cartItems.map(ele => {
      let obj = {
        productName: ele.productName,
        productId: ele._id,
        quantity: ele.qtyRequired,
        price: ele.price,
        taxId: ele.taxId,
        billingNumber: billNo,
        firstname: this.fName,
        lastname: this.lName,
        address: this.address,
        email: this.email,
        phonenumber: this.phone,
        payModeId: 1,
        paidamount: this.paidTotal
      };
      objArray.push(obj);
    });

    this.productService.generateInvoice(objArray).subscribe((res) => {
      if (res.success) {
        this.getproductsList();
        this.toastr.success('Sale is Completed', 'Success!', { progressBar: true });
        this.generateBill(billNo);
      } else {
        this.toastr.warning('Please Try Again', 'Warning!', { progressBar: true });
      }
    })
  }

  generateBill(billNo) {
    this.invoice = true;
    this.invoiceProducts = [];
    this.cartItems.map(ele => {
      let taxValue = this.getTaxValue(ele.taxId);
      let obj = {
        name: ele.productName,
        price: ele.price,
        qty: ele.qtyRequired,
        taxPercent: taxValue,
        taxPrice: ele.TaxPrice
      };
      this.invoiceProducts.push(obj);
    });
    this.invoiceProducts['fName'] = this.fName;
    this.invoiceProducts['lName'] = this.lName;
    this.invoiceProducts['address'] = this.address;
    this.invoiceProducts['email'] = this.email;
    this.invoiceProducts['phoneNum'] = this.phone;
    this.invoiceProducts['billNo'] = billNo;
  }

  postInvoice(eve) {
    this.invoice = false;
    this.clearCart();
  }

  decreaseQty(id) {
    this.productsList.find(o => o._id == id).qtyRequired = parseInt(this.productsList.find(o => o._id == id).qtyRequired) - 1;
    this.productsList.find(o => o._id == id).disableIncrease = false;
    if (this.productsList.find(o => o._id == id).qtyRequired == 0) {
      this.productsList.find(o => o._id == id).select = false;
      this.productsList.find(o => o._id == id).disableDecrease = true;
    } else {
      this.productsList.find(o => o._id == id).disableDecrease = false;
    }
    this.cartCount = this.productsList.filter(o => o.select == true).length;
  }

  increaseQty(id) {
    this.productsList.find(o => o._id == id).qtyRequired = parseInt(this.productsList.find(o => o._id == id).qtyRequired) + 1;
    this.productsList.find(o => o._id == id).select = true;
    this.productsList.find(o => o._id == id).disableDecrease = false;
    if (this.productsList.find(o => o._id == id).qtyRequired == this.productsList.find(o => o._id == id).quantity) {
      this.productsList.find(o => o._id == id).disableIncrease = true;
    } else {
      this.productsList.find(o => o._id == id).disableIncrease = false;
    }
    this.cartCount = this.productsList.filter(o => o.select == true).length;
  }

  changeQty(eve, id) {
    this.productsList.find(o => o._id == id).qtyRequired = parseInt(eve.target.value);
    if (this.productsList.find(o => o._id == id).qtyRequired == this.productsList.find(o => o._id == id).quantity) {
      this.productsList.find(o => o._id == id).disableIncrease = true;
    } else if (this.productsList.find(o => o._id == id).qtyRequired == 0) {
      this.productsList.find(o => o._id == id).select = false;
      this.productsList.find(o => o._id == id).disableDecrease = true;
    } else {
      this.productsList.find(o => o._id == id).select = true;
      this.productsList.find(o => o._id == id).disableDecrease = false;
    }
    this.cartCount = this.productsList.filter(o => o.select == true).length;
  }

  getTaxValue(taxId) {
    let taxValue;
    if (taxId == "5f68d6f0e27a37bd69be915b") {
      taxValue = 5;
    } else if (taxId == "5f68d75be27a37bd69be915c") {
      taxValue = 18;
    } else {
      taxValue = 20;
    }
    return taxValue;
  }

  calculatePercentage(percentage, total) {
    let result;
    let amount = (percentage / 100);
    result = amount * total;
    return result;
  }

  onNextClk() {
    this.billingInfo = false;
    this.paidTotal = this.grandTotal = this.cartItems.reduce((sum, p) => sum + (p.qtyRequired * (p.price + p.TaxPrice)), 0);
  }

  getPaymentModes() {
    this.productService.getPaymentModes().subscribe(res => {
      this.paymentModes = res;
    });
  }

  searchCode(eve) {
    // if (eve == "") {
    //   this.productsList = JSON.parse(JSON.stringify(this.masterProductList));
    // } else {
    //   this.productsList = this.productsList.filter((ele) => {
    //     return ele.productCode.toLowerCase() == eve.toLowerCase();
    //   });
    // }
  }

}
