import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})
export class EditproductComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditproductComponent>,
    @Inject(MAT_DIALOG_DATA) public id: any, public dialog:MatDialog, public _data:DataService, public _fb:FormBuilder) { }
    
    form:FormGroup= this._fb.group({
        id:[this.id],
        name:["",[Validators.required]],
        price:["",[Validators.required]],
        image:["",[Validators.required]],
        category_id:["",[Validators.required]]
    })

    async ngOnInit() {
      await this._data.getTypes()
      await this._data.getdataofproduct(this.id)
      await this._data.data && this.form.get('category_id').setValue(this._data.data[0].category_id) 
    }
    

  cancel(){
    this.dialog.closeAll()
  }


}


