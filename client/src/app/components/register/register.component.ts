import { DataService } from './../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  constructor(public _fb:FormBuilder, public _data:DataService) { }

  hide = true;
  form:FormGroup= this._fb.group({
    id:["",[Validators.required, Validators.minLength(9),Validators.maxLength(9)]],
    email:["",[Validators.required, Validators.email]],
    password1:["",[Validators.required]],
    password2:["",[Validators.required]]
  })

  form2:FormGroup= this._fb.group({
    city:["",[Validators.required]],
    street:["",[Validators.required]],
    first_name:["",[Validators.required]],
    last_name:["",[Validators.required]]
  })

  ngOnInit(): void {
  }

}
