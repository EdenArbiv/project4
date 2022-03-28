const { onlyLoggedUsers } = require('./onlyLoggedUsers')
const router = require('express').Router()
const { SQL } = require('../db')

router.get('/items',onlyLoggedUsers, async (req, res)=>{
    try {
        const products = await SQL(`SELECT products.id,
        products.name,
        products.price,
        products.image,
        category.category_name
        FROM products
        inner join category on category_id = category.id`)
        res.send(products)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.post('/additem',onlyLoggedUsers,async (req,res)=>{
    try {
        const {name, category_id, price, image} = req.body
        if(!name | !category_id | !price | !image){
            return res.status(400).send({err:'missing info'})   
        }
        await SQL(`insert into products(name, category_id, price, image)
        values("${name}",${category_id}, ${price}, "${image}");`)
        res.send({msg:'product added!'})
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.put('/:id',onlyLoggedUsers,async (req,res)=>{
    try {
        const { name, category_id, price, image } = req.body
        const { id } = req.params
        if(name){
            await SQL(`UPDATE products SET name = '${name}' WHERE id = ${id}`)
        }
        if(name){
            await SQL(`UPDATE products SET category_id = ${category_id} WHERE id = ${id}`)
        }
        if(name){
            await SQL(`UPDATE products SET price = ${price} WHERE id = ${id}`)
        }
        if(name){
            await SQL(`UPDATE products SET image = '${image}' WHERE id = ${id}`)
        }
        res.send({msg:'product update!'})

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.get('/types',onlyLoggedUsers,async (req,res)=>{
    try {
        const types = await SQL(`SELECT * FROM category`)
        res.send(types)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

router.get('/getdata/:id',onlyLoggedUsers,async (req,res)=>{
    try {
        const {id} = req.params 
        const types = await SQL(`SELECT * FROM products WHERE id = ${id}`)
        res.send(types)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


module.exports = router