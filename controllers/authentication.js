let jwt = require('jwt-simple');
let config = require('../config');

let User  = require('../models/user');


function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
exports.signup = (req,res,next) => {

    const email = req.body.email;
    const password = req.body.password
    // See if a user with a given email exists

    if(!email || !password){
        return res.status(422).send({error: "You must provide email and password"});
    }
    User.findOne({email: email}, (err, existingUser )=>{
        if(err){
            return next(err);
        }
        
        //If user with email does exist return an error
        if(existingUser){
            return res.status(422).send({error: "Email is in use"});
        } 
        
        // If a user with email does not exists, create and save user record
        const user = new User({
            email: email,
            password: password
        });
        user.save((err)=>{
            if(err) {return next(err) ;}
            
            // Respon to request indicating the user was created
            res.send({token: tokenForUser(user)});
            // res.json({success: true});
        });
    });



}

exports.signin = (req,res,next) =>{

    res.send({token: tokenForUser(req.user)})
}