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
    Email.find().sort({_id:-1}).populate("_Event").execFind(function(err, docs) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({emails:docs, result:"SUCCESS"});
        }
    });
};
exports.show = function(req, res){
    var id = req.params.id;
    Email.findOne({_id:id}).populate("_Event").exec(function (err, data){
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
    }
    var email = {
        Title:req.body.Title,
        Memo:req.body.Memo,
        //_Member:memberId,
        Creator:req.user,
        _Event:req.body._Event
    };
    var emailObj = new Email(email);
    emailObj.save(function(err, data){
        if(err){
            console.log("Create Email Fail");
            res.send({result:"FAIL", ERR:err});
        }else{
            if(data._Event != null){
                Event.update({_id: data._Event}, {'$push':{Emails:data._id}}, function (err,data) {
                    console.log(data);
                    if (err) {
                        res.send({result:"FAIL", ERR:err});
                    } else {
                        res.send({result: "SUCCESS"});
                    }
                });
            }else{
                res.send({result: "SUCCESS"});
            }
        }
    });
};
exports.update = function(req, res){
};
exports.destroy = function(req, res){
    //멤버 도큐멘트, 이벤트 도큐멘트 수정 후 삭제
    if(req.user == null){
        res.send({result:"FAIL", ERR:"logged out"});
        return false;
    }
    var id = req.params.id;

    Email.findById(id, function (err, doc) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            if(doc._Event){
                //이벤트 Surveys에서 해당 survey Id 제거
                console.log("have Event");
                Event.update({_id:doc._Event},{"$pull":{Emails:id}},function(err){
                    if(err){
                        console.log("remove Fail Email On Event");
                    }else{
                        console.log("remove Email On Event");
                    }
                });
            }
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