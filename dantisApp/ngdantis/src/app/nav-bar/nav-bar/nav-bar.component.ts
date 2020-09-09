import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  prod: boolean = true;
  usr: boolean = false;
  optName: string;

  @Input() source;

  constructor(private render:Renderer2,
    private router: Router) { }

  ngOnInit(): void {

    if(this.source.isAdmin){
      this.optName = 'Seller Page';
    }else {
      this.optName = 'Admin Page';
    }
    
  }

  addClass(val){
    if(val ==1){
      this.prod = true;
      this.usr = false;
    } else {
      this.prod = false;
      this.usr = true;
    }
  }

  optClick(){
    if(this.source.isAdmin){
      this.router.navigate(["/sale"]);
    }else {
      this.router.navigate(["/dash"]);
    }
  }

}
