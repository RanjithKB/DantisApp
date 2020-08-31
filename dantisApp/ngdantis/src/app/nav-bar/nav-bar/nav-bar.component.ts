import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  prod: boolean = true;
  usr: boolean = false;
  constructor(private render:Renderer2) { }

  ngOnInit(): void {
    
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

}
