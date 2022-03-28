import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  constructor(public _data:DataService) { }

  ngOnInit(): void {
  }

  url:any = `/static/order-${this._data.local.cartid}.txt`

}
