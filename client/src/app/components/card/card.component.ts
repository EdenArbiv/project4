import { EditproductComponent } from './../editproduct/editproduct.component';
import { PopupComponent } from './../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(public _data:DataService, public dialog:MatDialog) { }

  @Input()
  item:any

  ngOnInit(): void {
  }

  
  openPopUp(id:number){
    this.dialog.open(PopupComponent, {
      width: '300px',
      data: id
    })
  }

  openedit(id:number){
    this.dialog.open(EditproductComponent, {
      width: '500px',
      data: id,
      disableClose: true
    })
  }

}

