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

var Member = new Schema({
    Name:String,
    Id:String,
    Password:String,
    role:{},
    Events:[],
    Surveys:[],
    Emails:[]
});

module.exports = mongoose.model('Member',Member);