import { AddproductComponent } from './../addproduct/addproduct.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import  Product  from 'src/app/models/product.model';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  
})
export class ProductsComponent implements OnInit {

  constructor(public _data:DataService, public router:Router, public dialog:MatDialog) { }


  ngOnInit(): void {
    if(this._data.local.role == 'user'){
      this._data.getProducts()
    }else{
      this._data.getProductsAdmin()
    }
    
  }
  status: boolean = true;

  clickEvent(){
      this.status = !this.status;     
  }

  filterMilk(item: Product) {
    return item.category_name = "Milk"
  }

  openaddproduct(){
    this.dialog.open(AddproductComponent, {
      width: '500px',
      height: '500px',
      disableClose: true
    })
  }
  

  
}
