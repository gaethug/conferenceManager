/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 11:37
 * To change this template use File | Settings | File Templates.
 */
var passport = require('passport');
module.exports = {
    // Login a user
    login: passport.authenticate('local', {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failure'
    }),

    // on Login Success callback
    loginSuccess: function(req, res){
        console.log("login SUccess");
        console.log(req.session.passport);
        //req.session.cookie.expires = new Date(Date.now() + 60000);
        res.send({user:req.session.passport.user , result:"SUCCESS"});
    },

    // on Login Failure callback
    loginFailure: function(req, res){
        console.log("login Fail,");
        //console.log(res);
        res.send({result:"FAIL"});
    },

    // Log out a user
    logout: function(req, res){
        console.log("logout");
        req.logout();
        res.end();
    }

}