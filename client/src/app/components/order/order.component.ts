

import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, Validators, MaxLengthValidator } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(public _fb:FormBuilder, public _data:DataService,public router:Router) { }

  ngOnInit(): void {
    this._data.bringuserdata()
  }
  db:boolean
  today:any = new Date().toISOString().split('T')[0]
  creditCardTypes = [
    "Visa",
    "AmericanExpress",
    "Maestro",
    "JCB",
    "Discover",
    "DinersClub",
    "MasterCard"
]

  form:FormGroup= this._fb.group({
    city:[""],
    street:[""],
    date:[""],
    cardType:['Visa'],
    creditCard:['',[Validators.maxLength(3)]],
    cartid:[this._data.local.cartid],
    thetotalprice:[this._data.thetotalprice],
  })
  
  dbclick(){
    this.db = !this.db
  }

  applyFunc(form){
    this._data.progressbar = true
    this._data.applyOrder(form)
  }

}
