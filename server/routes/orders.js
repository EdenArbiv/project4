const { onlyLoggedUsers } = require('./onlyLoggedUsers')
const router = require('express').Router()
const { SQL } = require('../db')



router.get('/userdata', onlyLoggedUsers ,async (req,res)=>{
    try {
        const userdata = await SQL(`SELECT users.city,
        users.street
         FROM onlineshop.users 
         WHERE id = ${req.session.idnum}`)
        res.send(userdata)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


router.post('/neworder', onlyLoggedUsers ,async (req,res)=>{
    try {
        const { cartid, thetotalprice, city, street, date , creditCard } = req.body
        if(!city | !street | !date | !creditCard){
            return res.status(400).send({err:'missing some info'})
        }
        const checkdate = await SQL(`SELECT * FROM orders WHERE deliverydate = '${date}'`)
        if(checkdate.length > 3){
            return res.status(400).send({err:'You have to choose another day, all shipments are busy'})
        }

        if(creditCard.toString().length != 16){
            return res.status(400).send({err:'Please enter a 16-digit card number'})
        }
        await SQL(`insert into orders(cart_id, total_price, city, street , deliverydate , payment)
        values(${cartid}, ${thetotalprice}, '${city}', '${street}', '${date}', ${creditCard})`)
        await SQL(`UPDATE cart SET open = 0 WHERE id = ${cartid}`)
        await SQL(`UPDATE cart SET date = now() WHERE id = ${cartid}`)
        
        res.send({msg:'order accept'})

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})




module.exports = router