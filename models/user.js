let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
    email: {
        type:  String,
        unique: true,
        lowercase: true
    },
    password: String
});

userSchema.pre('save',function (next){
    const user = this;

    bcrypt.genSalt(10,function (err,salt){
        if (err) { return next(err);}

        bcrypt.hash(user.password,salt,null,function (err,hash){
            if(err) {return next(err)}

            user.password = hash;
            console.log(user);

            next();
        });
    });
});


userSchema.methods.comparePassword = function(candidatePassword,callback) {
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) {return callback(err);}

        callback(null,isMatch);
    })
}

// Create the model class
const ModelClass = mongoose.model('user',userSchema);

// Export the model
module.exports = ModelClass;