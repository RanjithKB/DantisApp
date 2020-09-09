import { Component, OnInit } from '@angular/core';
import { ProductService } from './../../product.service';

@Component({
  selector: 'app-seller-page',
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']
})
export class SellerPageComponent implements OnInit {
  productsList;
  saleObj ={
    isAdmin: false
  };
  cartCount: number = 0;
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getproductsList();
  }

  getproductsList(){
    this.productService.getProductsList().subscribe(res =>{
      this.productsList = res;
      this.productsList.map( ele =>{
        ele['select'] = false;
      })
    });
  }

  selectProduct(eve,id){
    if(eve.target.checked){
      this.productsList.find(o => o._id == id).select = true;
    } else {
      this.productsList.find(o => o._id == id).select = false;
    }
    this.cartCount = this.productsList.filter(o => o.select == true).length;
  }

}
