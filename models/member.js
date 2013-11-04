/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:06
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var PassportLocalStrategy = require('passport-local').Strategy;

var Member = new Schema({
    Name:String,
    Id:String,
    Password:String,
    role:{},
    Events:[{type: Schema.ObjectId, ref:"Event"}],
    Surveys:[{type: Schema.ObjectId, ref:"Survey"}],
    Emails:[{type: Schema.ObjectId, ref:"Email"}]
});
/* Auth properties      ---------------------------*/
/* (passport)           ---------------------------*/

// This is your main login logic
Member.statics.localStrategy = new PassportLocalStrategy({
        usernameField: 'Id',
        passwordField: 'Password'
    },

    // @see https://github.com/jaredhanson/passport-local
    function (username, password, done){
        console.log(username +" " + password);
        var User = require('./member');
        User.findOne({Id: username}, function(err, user){
            if (err) { return done(err); }
            console.log(user);
            if (!user){
                return done(null, false, { message: 'User not found.'} );
            }
            if (user.Password != password){
                console.log("not valid");
                return done(null, false, { message: 'Incorrect password.'} );
            }

            // I'm specifying the fields that I want to save into the user's session
            // *I don't want to save the password in the session
            return done(null, user);
        });
    }
);

Member.methods.validPassword = function(password){
    console.log(this.password);
    if (this.password == password){
        return true;
    }

    return false;
}

Member.statics.serializeUser = function(user, done){
    done(null, user);
};

Member.statics.deserializeUser = function(obj, done){
    done(null, obj);
};
module.exports = mongoose.model('Member',Member);