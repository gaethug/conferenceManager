/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오전 10:07
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Email = new Schema({
    Title:String,
    Memo:String,
    _Member:{type: Schema.ObjectId, ref:"Member"},
    _Event:{type: Schema.ObjectId, ref:"Event"}
});
module.exports = mongoose.model('Email',Email);