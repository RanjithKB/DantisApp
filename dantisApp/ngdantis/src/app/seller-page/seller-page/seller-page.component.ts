import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProductService } from './../../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
        this.cartItems.push(ele);
      }
    });
    this.modalService.open(this.cartModal);
  }

  clearCart() {
    this.cartItems = [];
    this.cartCount = 0;
    this.productsList.map(ele => {
      ele.select = false;
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
    this.cartItems.map(ele => {
      let obj = {
        name: ele.productName,
        price: ele.price,
        qty: 1
      };
      this.invoiceProducts.push(obj);
    });

  }

  postInvoice(eve) {
    this.invoice = false;
    this.clearCart();
  }

}
