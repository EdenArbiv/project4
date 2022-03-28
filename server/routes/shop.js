const router = require('express').Router()
const { SQL } = require('../db')
const { onlyLoggedUsers } = require('./onlyLoggedUsers')


router.get('/:cartid',onlyLoggedUsers,async (req,res)=>{
    const {cartid} = req.params

    try {
        const products = await SQL(`SELECT products.id,
        products.name,
        products.price,
        products.image,
        category.category_name
        FROM products
        inner join category on category_id = category.id`)

        const cartitems = await SQL(`SELECT cartitems.qt,
        cart.id,
        cart.user_id,
        cart.date,
        products.id as product_id,
        products.name as name,
        products.price,
        products.image,
        category.category_name as category
        FROM cartitems 
        inner join cart on cart_id = cart.id
        inner join products on product_id = products.id
        inner join category on products.category_id = category.id 
        WHERE cart.id = ${cartid}`)
        res.send({products, cartitems })
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.post('/addtocart',onlyLoggedUsers,async (req,res)=>{
    try {
        const { product_id, cart_id, qt } = req.body
        const exist = await SQL(`SELECT * FROM cartitems WHERE cart_id = ${cart_id} AND product_id = ${product_id}`)
        if(!qt){
            return res.status(400).send({err:'please press amount!'})
        }
        if(!exist.length){
            await SQL(`insert into cartitems(product_id, cart_id, qt)
            values(${product_id}, ${cart_id}, ${qt})`)
        }else{
            await SQL(`UPDATE cartitems SET qt = ${qt} WHERE cart_id = ${cart_id} AND product_id = ${product_id}`)
        }
        res.send({msg:'product added to cart!'})
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.post('/addfromcart',onlyLoggedUsers,async (req,res)=>{
    try {
        const { product_id, cart_id } = req.body
        const exist = await SQL(`SELECT * FROM cartitems WHERE cart_id = ${cart_id} AND product_id = ${product_id}`)
        if(!exist.length){
            await SQL(`insert into cartitems(product_id, cart_id)
            values(${product_id}, ${cart_id})`)
        }else{
            await SQL(`UPDATE cartitems SET qt = qt+1 WHERE cart_id = ${cart_id} AND product_id = ${product_id}`)
        }
        res.send({msg:'product added!'})
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.delete('/deletefromcart',onlyLoggedUsers,async (req,res)=>{
    try {
        const { product_id, cart_id } = req.body
        const exist = await SQL(`SELECT * FROM cartitems WHERE cart_id = ${cart_id} AND product_id = ${product_id}`)
        if(exist[0].qt == 1){
            await SQL(`DELETE FROM cartitems WHERE cart_id = ${cart_id} AND product_id = ${product_id} `)
        }else{
            await SQL(`UPDATE cartitems SET qt = qt-1 WHERE cart_id = ${cart_id} AND product_id = ${product_id}`)
        }
        res.send({msg:'product deleted!'})
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.delete('/resetcart/:cartid',onlyLoggedUsers,async (req,res)=>{
    try {
        const { cartid } = req.params 
        if(!cartid){
            return res.status(400).send({msg:'cart not found!'})
        }
        await SQL(`DELETE FROM cartitems WHERE cart_id = ${cartid}`)
        res.send({msg:'items deleted!'})
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


router.post('/search',onlyLoggedUsers,async (req,res)=>{
    try {
        const { search } = req.body
       
        if(!search){
            const products = await SQL(`SELECT products.id,
            products.name,
            products.price,
            products.image,
            category.category_name
            FROM products
            inner join category on category_id = category.id`)
            return res.send(products)
        }else{  
            const products = await SQL(`SELECT * FROM products
            WHERE products.name 
            LIKE'%${search}%'`)
            return res.send(products)
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


module.exports = router