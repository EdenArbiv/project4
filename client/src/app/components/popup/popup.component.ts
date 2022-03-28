import { DataService } from 'src/app/services/data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public _data:DataService, public _fb:FormBuilder) { }

  ngOnInit(): void {
  }
  form:FormGroup= this._fb.group({
    Number:["",[Validators.required]],
  })

  invalidChars = [
    "-",
    "+",
    "e",
  ];

  
  cancel(){
    this.dialogRef.close()
  }

  confirm(form){
    console.log(form.Number)
    if(!form.Number.toString().includes("-")){
       this._data.addToCart({cart_id:this._data.local.cartid, product_id:this.data ,  qt:form.Number})
      if(form.Number){
      this.dialogRef.close()
      this._data.error = ""
      }
    }
  }
}
