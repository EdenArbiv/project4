import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(public router:Router, public _data:DataService) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')){
      this._data.local= JSON.parse(localStorage.getItem('user'));   
    }
  }

  

}
