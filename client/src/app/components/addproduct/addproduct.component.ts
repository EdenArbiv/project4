import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})
export class AddproductComponent implements OnInit {

  constructor(public dialog:MatDialog, public _data:DataService, public _fb:FormBuilder) { }

  form:FormGroup= this._fb.group({
    name:["",[Validators.required]],
    price:["",[Validators.required]],
    image:["",[Validators.required]],
    category_id:["",[Validators.required]]
  })

  ngOnInit(): void {
    this._data.getTypes()
  }

  cancel(){
    this.dialog.closeAll()
  }

 
}
