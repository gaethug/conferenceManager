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

var Event = new Schema({
    Title:String,
    Memo:String,
    Creator:{},
    //_Member:{type: Schema.ObjectId, ref:"Member"},
    Surveys:[{type: Schema.ObjectId, ref:"Survey"}],
    Emails:[{type: Schema.ObjectId, ref:"Email"}]
});
module.exports = mongoose.model('Event',Event);