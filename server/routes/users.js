const { onlyLoggedUsers } = require('./onlyLoggedUsers')
const router = require('express').Router()
const { SQL } = require('../db')
const bcrypt = require('bcrypt')
let saveid = ""
let savepassword = ""
let saveemail = ""

function validateEmail (emailAdress)
{
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true; 
  } else {
    return false; 
  }
}

router.get('/',async (req,res)=>{
    try {
      const admin = await SQL(`SELECT * FROM users WHERE role = "admin"`)
        if(!admin.length){
        const hashed = await bcrypt.hash('123', 10)
        await SQL(`insert into users(id, first_name, last_name, email, password, city, street, role) values(315253740, 'Eden', 'Arbiv','edenarbiv123@gmail.com', '${hashed}', 'Hadera', 'Epshtein 5', 'admin' )`)
    }  
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
    
})


router.get('/',async (req,res)=>{
    try {
        const products = await SQL(`SELECT * FROM products`)
        const orders = await SQL(`SELECT * FROM orders`)
        res.send({products: products.length, orders: orders.length})
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.post('/register1',async (req,res)=> {
    try {
        const {id ,email, password1, password2} = req.body
        const user = await SQL(`SELECT * FROM users WHERE id = ${id}`)
        const checkemail = await SQL(`SELECT * FROM users WHERE email= '${email}'`)

        if(!id || !password1 || !password2 || !email){
            return res.status(400).send({err:'Please fill in all the fields!'})
        }
        if(password1 !== password2){
            return res.status(400).send({err:'The passwords do not match'})
        }
        if(id.toString().length != 9){
            return res.status(400).send({err:'ID must have 9 numbers'})
        }
        if(!validateEmail(email)){
            return res.status(400).send({err:'Invalid Email'})
        }
        if(user.length){
            return res.status(400).send({err:'ID already exists in the system, please login.'}) 
        }

        if(checkemail.length){
            return res.status(400).send({err:'Email already exists in the system, please login'}) 
        }
        saveid = id
        saveemail = email
        savepassword = password1
        res.send({msg:'success'})
    } catch (err) {
    console.log(err);
    res.sendStatus(500)
    }
})

router.post('/register2',async (req,res)=> {
    try {
        const {city ,street, first_name, last_name} = req.body
        if(!city || !street || !first_name || !last_name){
            return res.status(400).send({err:'Please fill in all the fields!'}) 
        }
        const hashedPassword = await bcrypt.hash(savepassword, 10)
        await SQL(`insert into users(id, first_name, last_name, email, password, city, street) values(${saveid}, '${first_name}', '${last_name}','${saveemail}', '${hashedPassword}', '${city}', '${street}' )`)
        res.send({msg:'user created! please login'})

        saveid = ""
        saveemail = ""
        savepassword = ""
    } catch (err) {
    console.log(err);
    res.sendStatus(500)
    }
})

router.post('/newcart',async (req,res)=> {
    try {
        const existcart = await SQL(`SELECT cart.id as cartid,
        cart.date,
        cart.open,
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.role
        FROM cart
        inner join users on user_id = users.id
        WHERE user_id = ${req.session.idnum}
        order by date DESC;`)
        if(existcart.length){
            if(!existcart[0].open){
            await SQL(`insert into cart(user_id)
            values(${req.session.idnum})`)
            const cartid = await SQL(`SELECT * FROM cart WHERE user_id = ${req.session.idnum} ORDER BY date DESC`)
            return res.send({msg:"new cart created!", cartid: cartid[0].id})
            }else{
            return res.send({msg:'welcome back'})
            }
        }else{
            await SQL(`insert into cart(user_id)
            values(${req.session.idnum})`)
            const cartid = await SQL(`SELECT * FROM cart WHERE user_id = ${req.session.idnum}`)
            return res.send({msg:"new cart created", cartid: cartid[0].id})
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


router.post('/login',async (req,res)=> {
    try {
        const {id, password} = req.body
        if(!id || !password){
        return res.status(400).send({err:'Please fill in all the fields!'})
        }
        const user = await SQL(`SELECT * FROM users WHERE id = ${id}`)
        if(!user.length){
        return res.status(400).send({err:'wrong username'})   
        }
       
        if(!await bcrypt.compare(password, user[0].password)){
            return res.status(400).send({err:'wrong password'})
        }

        const userdata = await SQL(`SELECT users.id, users.first_name, users.last_name, users.role FROM users WHERE id = ${id}`)
        const cartdata = await SQL(`SELECT cart.id as cartid,
        cart.date,
        cart.open,
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.role
        FROM cart
        inner join users on user_id = users.id
        WHERE user_id = ${id}
        ORDER BY date DESC;`)
   
        req.session.idnum = id;
        res.send({msg:"successfull login", userdata, cartdata , session: req.session.idnum})
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.get('/whoami', (req,res)=> {
    res.send({msg:req.session.idnum})
})

router.delete('/logout',onlyLoggedUsers, (req,res)=> {
    if(req.session){
        req.session.destroy(err=>{
            if(err){
                res.status(400).send('unable to log out')
            }else{
                res.send({msg:'Logout Successful'})
            }
        })
    }
   
})  



module.exports = router