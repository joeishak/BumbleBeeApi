
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();



exports.postRequestTest = (req,res,next) =>{
    console.log('Request', req.body);
    res.send({message: 'successfull', request: req.body})
}




