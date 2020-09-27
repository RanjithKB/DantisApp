import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProductService } from './../../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IfStmt } from '@angular/compiler';


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
  @ViewChild('cartModal') cartModal: TemplateRef<any>;

  constructor(private productService: ProductService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getproductsList();
  }

  getproductsList() {
    this.productService.getProductsList().subscribe(res => {
      this.productsList = res;
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
    this.modalService.open(this.cartModal);
    console.log('dds', this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cartCount = 0;
    this.productsList.map(ele => {
      ele.select = false;
      ele.qtyRequired = 0;
      ele.disableDecrease = true;
    });
    this.modalService.dismissAll();
  }

  removeItem(id) {
    let index = this.cartItems.findIndex(o => o._id == id);
    let indexProduct = this.productsList.findIndex(o => o._id == id);
    this.productsList[indexProduct].select = false;
    this.cartItems.splice(index, 1);
    this.cartCount = this.cartItems.length;
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  generateInvoice() {
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

}
