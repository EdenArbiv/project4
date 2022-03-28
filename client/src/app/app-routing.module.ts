import { ReceiptComponent } from './components/receipt/receipt.component';
import { OrderComponent } from './components/order/order.component';
import { ProductsComponent } from './components/products/products.component';
import { ShopComponent } from './components/shop/shop.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { Page404Component } from './components/page404/page404.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersGuard } from './guards/users.guard';


const routes: Routes = [
  {path:'home', component:HomeComponent,
   children:[
    {path:'login', component:LoginComponent},
    {path:'',redirectTo:'login', pathMatch:'full'},
    {path:'register', component:RegisterComponent}
  ]},
  {path:'shop', component:ShopComponent, canActivate:[UsersGuard],
  children:[
    {path:'', component:ProductsComponent},
    {path:'order', component:OrderComponent},
    {path:'receipt', component:ReceiptComponent},
  ]},
  {path:'',redirectTo:'home', pathMatch:'full'},
  {path:'**', component:Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
