import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public _data:DataService, public router:Router) { }

  opentoolbar:boolean = false;

  ngOnInit(): void {
  }

  changeoption(){
    this.opentoolbar = !this.opentoolbar
  }
}
