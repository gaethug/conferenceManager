/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:22
 * To change this template use File | Settings | File Templates.
 */

var Survey = require('../models/survey.js');

exports.index = function(req, res){
    Survey.find().sort({_id:-1}).execFind(function(err, docs) {
        if(err){
            res.send({result:"FAIL", ERR:err});
        }else{
            res.send({surveys:docs, result:"SUCCESS"});
        }
    });
};
exports.show = function(req, res){
};
exports.create = function(req, res){

};
exports.update = function(req, res){
};
exports.destroy = function(req, res){
};