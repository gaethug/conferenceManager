/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 10. 22.
 * Time: 오후 4:58
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Participant = new Schema({
    Name:String,
    Email:String,
    Company: String,
    Depart : String,
    Title:String,
    Qrcode:String
});

module.exports = mongoose.model('Participant',Participant);