module.exports.onlyLoggedUsers = (req, res, next) => {
    if(req.session.idnum){
        next()
    }else{
        res.status(401).send({err:'sensetive content for logged users only, please log in '})
   
    }
}