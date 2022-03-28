const express = require('express')
const session = require('express-session')
const cors = require('cors')
const fs = require('fs/promises')
const { SQL } = require('./db')


const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:4200",
    credentials: true
}))

app.use(session({
    secret: "123",
    name: "Eden",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge:1000*60*60*24
    }
}))


app.use('/', require('./routes/users'))
app.use('/shop', require('./routes/shop'))
app.use('/admin', require('./routes/admin'))
app.use('/orders', require('./routes/orders'))

app.use(express.static('receipts'))
app.post('/:cartid',async (req,res)=> {
    const {cartid} = req.params
    const cartitems = await SQL(`SELECT cartitems.id,
    cartitems.qt,
    cart.user_id,
    cart.date,
    products.name as name,
    products.price,
    products.image,
    category.category_name as category
    FROM cartitems 
    inner join cart on cart_id = cart.id
    inner join products on product_id = products.id
    inner join category on products.category_id = category.id 
    WHERE cart.id = ${cartid}`)

    let recp = `ORDER #${cartid}`
    let thetotalprice = cartitems.reduce(
        (previousValue, item) => previousValue  += item.price*item.qt ,0)
    
    for (const item of cartitems) {
        recp += `\n\n ${item.name}: ${item.price}₪ , x${item.qt} \n ----------`
    }
    recp += `\n\n The Total Price : ${thetotalprice.toFixed(2)}₪`

    fs.writeFile(__dirname+`/receipts/order-${cartid}.txt`, recp) 
})


app.get('/static/:cartid',async (req,res)=>{
    const {cartid} = req.params
    console.log(cartid)
    const file = `${__dirname}/receipts/order-${cartid}.txt`;
    res.download(file,`order-${cartid}.txt`); 
})

app.listen(1000, ()=> console.log('server run on port 1000😁'))