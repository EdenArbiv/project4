import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0,0,10%)'
      })),
      state('out', style({
        transform: 'translate3d(-5%, 0, 0)'
      })),
      transition('in => out', animate('700ms ease-in-out')),
      transition('out => in', animate('700ms ease-in-out'))
    ]),
  ]
})
export class ShopComponent implements OnInit {

  constructor(public _data:DataService) { }

  showFiller:boolean = false;

  ngOnInit(): void {
    if(this._data.local.role == 'user'){
      this._data.getProducts()
    }else{
      this._data.getProductsAdmin()
    }
  }

  menuState:string = 'out';

  toggleMenu(){
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.showFiller = !this.showFiller
  }

}
