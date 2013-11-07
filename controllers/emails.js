/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:22
 * To change this template use File | Settings | File Templates.
 */

var Email = require('../models/email.js');
var Event = require('../models/event.js');
var Member = require('../models/member.js');

exports.index = function(req, res){
    Email.find().sort({_id:-1}).populate("_Member _Event").execFind(function(err, docs) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({emails:docs, result:"SUCCESS"});
        }
    });
};
exports.show = function(req, res){
    var id = req.params.id;
    Email.findOne({_id:id}).populate("_Member _Event").exec(function (err, data){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({email:data , result:"SUCCESS"});
        }
    });
};
exports.create = function(req, res){
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }else{
        var memberId = req.user._id;
    }
    var email = {
        Title:req.body.Title,
        Memo:req.body.Memo,
        _Member:memberId,
        _Event:req.body._Event
    };
    var emailObj = new Email(email);
    emailObj.save(function(err, data){
        if(err){
            console.log("Create Email Fail");
            res.send({result:"FAIL", ERR:err});
        }else{
            Member.update({_id: memberId}, {'$push':{Emails:data._id}}, function (err,data) {
                console.log(data);
                if (err) {
                    res.send({result:"FAIL", ERR:err});
                } else {
                    res.send({result: "SUCCESS"});
                }
            });
            if(data._Event != null){
                Event.update({_id: data._Event}, {'$push':{Emails:data._id}}, function (err,data) {
                    console.log(data);
                    if (err) {
                        res.send({result:"FAIL", ERR:err});
                    } else {
                        res.send({result: "SUCCESS"});
                    }
                });
            }
        }
    });
};
exports.update = function(req, res){
};
exports.destroy = function(req, res){
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }
    var id = req.params.id;
    Email.remove({_id:id}, function(err){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({result:"SUCCESS"});
        }
    });
};