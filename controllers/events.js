/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:22
 * To change this template use File | Settings | File Templates.
 */

var Event = require('../models/event.js');
var Member = require('../models/member.js');

exports.index = function(req, res){
    Event.find().sort({_id:-1}).populate("_Member").execFind(function(err, docs) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({events:docs, result:"SUCCESS"});
        }
    });
};
exports.show = function(req, res){
    var id = req.params.id;
    Event.findOne({_id:id}).populate("_Member Surveys Emails").exec(function (err, data){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({event:data , result:"SUCCESS"});
        }
    });
    /*Event.findOne({_id:id}, function (err, data){
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({events:data , result:"SUCCESS"});
        }
    });*/
};
exports.create = function(req, res){
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }else{
        var memberId = req.user._id;
    }
    var event = {
        Title:req.body.Title,
        Memo:req.body.Memo,
        _Member:memberId
    };
    var eventObj = new Event(event);
    eventObj.save(function(err, data){
        if(err){
            console.log("Create Event Fail");
            res.send({result:"FAIL", ERR:err});
        }else{
            Member.update({_id: memberId}, {'$push':{Events:data._id}}, function (err,data) {
                console.log(data);
                if (err) {
                    res.send({result:"FAIL", ERR:err});
                } else {
                    res.send({result: "SUCCESS"});
                }
            });
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
    var event = {
        Title:req.body.Title,
        Memo:req.body.Memo
    };
    Event.update({_id:id}, event, function(err){
        if(err){
            console.log("update Event Fail");
            res.send({result:"FAIL", ERR:err});
        }else{
            console.log("update Event SUCCESS");
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
    Event.remove({_id:id}, function(err){
        if(err){
            console.log("destroy Event Fail");
            res.send({result:"FAIL", ERR:err});
        }else{
            console.log("destroy Event SUCCESS");
            res.send({result:"SUCCESS"});
        }
    });
};