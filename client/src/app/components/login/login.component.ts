import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public _fb:FormBuilder, public _data:DataService, public router:Router) { }

  hide:boolean = true;
  form:FormGroup= this._fb.group({
    id:["",[Validators.required]],
    password:["",[Validators.required]]
  })
  localS:boolean = false

  ngOnInit(): void {
    this._data.homePage()
  }

}
