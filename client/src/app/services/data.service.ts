import { MatDialog } from '@angular/material/dialog';

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Product from '../models/product.model';
import User from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public router:Router,  public snakebar:MatSnackBar, public dialog:MatDialog) { }
  error:string= "";
  numofproducts:number
  numoforders:number
  next:boolean = false
  productsArr:Product[] = []
  cartitems:Product[] = []
  local:any
  cartid:number
  ifsearch:boolean = false
  userdata:any
  thetotalprice:number = 0
  progressbar:boolean
  numofmyprod:number
  types:any
  data:Product[]

  totalprice(){
  this.thetotalprice = this.cartitems.reduce(
  (previousValue, item) => previousValue  += item.price*item.qt ,0)
  }
  
   
  

  opensnakebar(message:string, action:string){
    this.snakebar.open(message, action,{duration: 2000 ,panelClass: ['snackbar'],
  })
  }

  closeNext(){
    this.next = false
  }

  async homePage(){
    const res = await fetch(`http://localhost:1000/`)
    const data = await res.json()
    console.log(data)
    this.numofproducts = data.products
    this.numoforders = data.orders
  }

  async loginUser(body:{form:User}){
    const res = await fetch('http://localhost:1000/login',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(body),
      credentials:"include"
    })
    const data = await res.json()
    if(res.status == 400){
      this.error = data.err
    
    }else{
      console.log(data)
      if(data.cartdata.length){
        localStorage.setItem('user', JSON.stringify({
          id: data.userdata[0].id,
          name: data.userdata[0].first_name+" "+data.userdata[0].last_name,
          opencart:data.cartdata[0].open,
          opencartdate:data.cartdata[0].date,
          cartid:data.cartdata[0].cartid,
          role: data.userdata[0].role
      }));
      }else{
        localStorage.setItem('user', JSON.stringify({
          id: data.userdata[0].id,
          name: data.userdata[0].first_name+" "+data.userdata[0].last_name,
          opencart: 0,
          opencartdate: 0, 
          role: data.userdata[0].role
      })); 
      }
      this.local = JSON.parse(localStorage.getItem('user'))
      this.error = ""
    }
  }

  async logoutUser(){
    const res = await fetch('http://localhost:1000/logout',{
      method:'DELETE',
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    window.localStorage.clear()
    this.router.navigate(['/home']);
    this.local = ""
  }

  async register1(body:{form:User}){
    const res = await fetch('http://localhost:1000/register1',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(body),
      credentials:"include"
    })
    const data = await res.json()
    if(res.status == 400){
      this.error = data.err
    }else{
      console.log(data)
      this.error = ""
      this.next = true
    }
  }

  async register2(body:{form2:User}){
    const res = await fetch('http://localhost:1000/register2',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(body),
      credentials:"include"
    })
    const data = await res.json()
    if(res.status == 400){
      this.error = data.err
    }else{
      console.log(data)
      this.error = ""
      this.next = false
      this.router.navigate(['/home']);
      this.opensnakebar(data.msg,'Ok');
    }
  }

  async newCart(){
    const res = await fetch('http://localhost:1000/newcart',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      credentials:"include"
    })
    const data = await res.json()
    this.router.navigate(['/shop']);
    if(data.msg == "welcome back"){
      this.local.opencart == true
    }else{
      this.local.cartid = data.cartid
      localStorage.setItem('user', JSON.stringify(this.local))
    }
  }

  
  async getProducts(){
    const res = await fetch(`http://localhost:1000/shop/${this.local.cartid}`,{
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    this.productsArr = data.products
    this.cartitems = data.cartitems
    this.numofmyprod= data.cartitems.length
    this.totalprice()
  }

  async addToCart(body:{cart_id:number, product_id:number, qt:number}){
    const res = await fetch('http://localhost:1000/shop/addtocart',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(body),
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    if(res.status == 400){
      this.error= data.err
      console.log(data.err)
    }
    this.getProducts()
    this.totalprice()
  }

  async addFromCart(body:{cart_id:number, product_id:number}){
    const res = await fetch('http://localhost:1000/shop/addfromcart',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(body),
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    this.getProducts()
    this.totalprice()
  }

  async deleteFromCart(body:{cart_id:number, product_id:number}){
    const res = await fetch('http://localhost:1000/shop/deletefromcart',{
      method:'DELETE',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(body),
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    this.getProducts()
    this.totalprice()
  }

  async resetCart(cartid:number){
    console.log(cartid)
    const res = await fetch(`http://localhost:1000/shop/resetcart/${cartid}`,{
      method:'DELETE',
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    this.getProducts()
    this.totalprice()
  }

  async search(search:string){
    console.log(this.cartitems)
    const res = await fetch('http://localhost:1000/shop/search',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(search),
      credentials:"include"
    })
    const data = await res.json()
    this.productsArr = data
    if(search.search.length){
      this.ifsearch = true
    }else{
      this.ifsearch = false
    }
  }

  searchInCart(form:any){
    if(!form.search){
      this.getProducts()
    }else{
      this.cartitems = this.cartitems.filter((item)=> item.name.toLocaleLowerCase().includes(form.search))
    }
  }

  async bringuserdata(){
    const res = await fetch(`http://localhost:1000/orders/userdata`,{
      credentials: 'include'
    })
    const data = await res.json()
    console.log(data)
    this.userdata = data
  }

  async applyOrder(form: any){
    const res = await fetch('http://localhost:1000/orders/neworder',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(form),
      credentials:"include"
    })
    const data = await res.json()
    if(res.status == 400){
      this.error = data.err
      this.progressbar = false
    }else{
      fetch(`http://localhost:1000/${form.cartid}`,{
        method:'POST',
        headers: { 'content-type':'application/json' },
        body: JSON.stringify(form),
        credentials:"include"
      })
      this.error = ""
      console.log(form)
      await new Promise(resolve => setTimeout(()=>{
        this.progressbar = false
         this.router.navigate(['/shop/receipt']);
      }, 3000))  
    }
 
  }
  
  async getReceipt(cartid:number){
    const res = await fetch(`http://localhost:1000/static/${cartid}`,{
      method:'GET',
      headers: { 'content-type':'application/json' },
      credentials:"include"
    })
    if(!res.ok){
      return alert('sorry, something went wrong')
    } 
    window.open(res.url)
  }

  async getTypes(){
    const res = await fetch(`http://localhost:1000/admin/types`,{
      credentials: 'include'
    })
    const data = await res.json()
    this.types = data
  }

  async getProductsAdmin(){
    const res = await fetch('http://localhost:1000/admin/items',{
      credentials:"include"
    })
    const data = await res.json()
    this.productsArr = data
  }

  async additem(form:any){
    const res = await fetch('http://localhost:1000/admin/additem',{
      method:'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(form),
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    if(res.status == 400){
      this.error= data.err
    }else{
      this.getProductsAdmin()
      this.dialog.closeAll()
      this.error= "" 
      this.opensnakebar(data.msg,'Dismiss');
    }
  }

  async edititem(form:any){
    const res = await fetch(`http://localhost:1000/admin/${form.id}`,{
      method:'PUT',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(form),
      credentials:"include"
    })
    const data = await res.json()
    console.log(data)
    if(res.status == 400){
      this.error= data.err
    }else{
      this.getProductsAdmin()
      this.dialog.closeAll()
      this.error= "" 
      this.opensnakebar(data.msg,'Dismiss');
    }
  }

  async getdataofproduct(id:number){
    const res = await fetch(`http://localhost:1000/admin/getdata/${id}`,{
      credentials: 'include'
    })
    const data = await res.json()
    this.data = data
  }

}
 