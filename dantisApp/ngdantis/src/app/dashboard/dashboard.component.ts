import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('editModal') editModal : TemplateRef<any>;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  
  }

  addNew() {
    this.modalService.open(this.editModal);
  }
}
