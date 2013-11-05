/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:22
 * To change this template use File | Settings | File Templates.
 */

var Member = require('../models/member.js');
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
    Member.findOne({_id:id}, function (err, data){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({member:data , result:"SUCCESS"});
        }
    });
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
    var user = {};
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }
    var id = req.params.id;
    Member.remove({_id:id}, function(err){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({result:"SUCCESS"});
        }
    });
};