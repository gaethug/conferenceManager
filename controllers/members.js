/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:22
 * To change this template use File | Settings | File Templates.
 */

var Member = require('../models/member.js');
var Event = require('../models/event.js');
var Survey = require('../models/survey.js');
var Email = require('../models/email.js');

exports.index = function(req, res){
    console.log(req.user);
    Member.find().sort({_id:-1}).execFind(function(err, docs) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({members:docs, result:"SUCCESS"});
        }
    });
};
exports.show = function(req, res){
    var id = req.params.id;
    /*Member.findOne({_id:id}).populate("Surveys Events Emails").exec(function (err, data){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({member:data , result:"SUCCESS"});
        }
    });*/
    Member.findOne({_id:id}).exec(function (err, member){
        var data = member;
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({member:data , result:"SUCCESS"});
        }
    });
};
exports.showDetail = function(req, res){
    var id = req.params.memberId;
    var childName =req.params.childName;
    if(childName=="events"){
        Event.find({_Member:id}).sort({_id:-1}).execFind(function(err, docs) {
            if(err){
                res.send({result:"FAIL", ERR:err});
            }else{
                res.send({events:docs, result:"SUCCESS"});
            }
        });
    }else if(childName=="surveys"){
        Survey.find({_Member:id}).sort({_id:-1}).execFind(function(err, docs) {
            if(err){
                res.send({result:"FAIL", ERR:err});
            }else{
                res.send({surveys:docs, result:"SUCCESS"});
            }
        });
    }else if(childName=="emails"){
        Email.find({_Member:id}).sort({_id:-1}).execFind(function(err, docs) {
            if(err){
                res.send({result:"FAIL", ERR:err});
            }else{
                res.send({emails:docs, result:"SUCCESS"});
            }
        });
    }

};
exports.create = function(req, res){
    //console.log(userRoles.user);
    var member = {
        Name:req.body.Name,
        Id:req.body.Id,
        Password:req.body.Password,
        role:req.body.role
    };
    var memberObj = new Member(member);
    memberObj.save(function(err, data){
        if(err){
            console.log("Create Member Fail");
            res.send({result:"FAIL", ERR:err});
        }else{
            console.log("Create Member Success");
            res.send({member:data , result:"SUCCESS"});

        }
    });
};
exports.update = function(req, res){
    var user = {};
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }
    var id = req.params.id;
    var member = {
        Name:req.body.Name,
        Id:req.body.Id,
        Password:req.body.Password
    };
    Member.update({_id:id}, member, function(err){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({result:"SUCCESS"});
        }
    });
};
exports.destroy = function(req, res){
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }
    var id = req.params.id;
    Member.findById(id, function (err, doc) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            /*Event.remove({_Member:id}, function(err){
                if(err){
                    console.log("remove All Fail Events On Member");
                }else{
                    console.log("remove All Events On Member");
                }
            });
            Survey.remove({_Member:id}, function(err){
                if(err){
                    console.log("remove All Fail Surveys On Member");
                }else{
                    console.log("remove All Surveys On Member");
                }
            });
            Email.remove({_Member:id}, function(err){
                if(err){
                    console.log("remove All Fail Emails On Member");
                }else{
                    console.log("remove All Emails On Member");
                }
            });*/
            doc.remove(function(err){
                if(err){
                    res.send({result:"FAIL", ERR:err});
                }else{
                    res.send({result:"SUCCESS"});
                }
            });
        }
    });
};