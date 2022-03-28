import { DataService } from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NextGuard implements CanActivate {
  constructor(public _r:Router, public _data:DataService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._data.next){
        return true;
      }else{
        this._r.navigateByUrl('/home/register')
       return false;
      }
  }
  
}
