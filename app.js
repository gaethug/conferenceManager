
/**
 * Module dependencies.
 */
var application_root = __dirname;
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var phantomjs = require('phantomjs');
var child_process  = require("child_process");
var qrCode = require('qrcode-npm');
var Converter=require("csvtojson").core.Converter;
var excelParser = require('excel-parser');
var excelbuilder = require('msexcel-builder');
var parseXlsx = require('excel');
var csv = require('csv');
var mongoose = require('mongoose');
var fs = require('fs');
var REQUEST_TIMEOUT = 30*1000;

//var participantModel = require('../models/participant');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(application_root, "public")));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*mongoose.connect('mongodb://localhost:27017');
mongoose.connection.on('open', function() {
    console.log('Connected to Mongoose');
});*/

app.get('/',routes.index);
app.get('/pdf',routes.pdf);
app.get('/fragments/:type/:name', routes.fragments);

app.get('/excel', function(req, res){
    /*excelParser.parse({
        inFile: __dirname+'/public/userfiles/master.xls',
        skipEmpty: true,
        searchFor: {
            term: ['my serach term'],
            type: 'loose'
        }
    }, function(err, records){
        if(err) console.error(err);

        console.log(records);
    });*/
    var opts ="" ;
    var workbook = excelbuilder.createWorkbook( __dirname+'/public/userfiles/','sample.xlsx');
    var sheet1 = workbook.createSheet('sheet1', 10, 12);
    sheet1.set(1, 1, 'I am title');
    for (var i = 2; i < 5; i++)
        sheet1.set(i, 1, 'test'+i);

    // Save it
    workbook.save(function(ok){
        if (!ok)
            workbook.cancel();
        else
            console.log('congratulations, your workbook created');
    });


    /*csv()
        .from.path(__dirname+'/public/userfiles/imsi.csv', { delimiter: ',', escape: '"' })
        .to.stream(fs.createWriteStream(__dirname+'/public/userfiles/test.txt'))
        .transform( function(row){
            row.unshift(row.pop());
            //console.log(row);
            return row;
        })
        .on('record', function(row,index){
            //console.log('#'+index+' '+JSON.stringify(row));
            console.log(row[0]);
            console.log(row[1]);
            console.log(row[2]);
            console.log(row[3]);
            var qrMSG = req.body.Name+" "+req.body.Company+" "+req.body.Depart+" "+req.body.Title;
            var qr = qrCode.qrcode(4, 'M');
            qr.addData(qrMSG);
            qr.make();
            var qrimgtag = qr.createTableTag(4);




            //res.send({title:'QRCODE', qrcodeURL:row});
        })
        .on('close', function(count){
            // when writing to a file, use the 'close' event
            // the 'end' event may fire before the file has been written
            console.log('Number of lines: '+count);
        })
        .on('error', function(error){
            console.log(error.message);
        });*/
   /* parseXlsx(__dirname+'/public/userfiles/master.xls', function(err, data) {
        if(err) throw err;
        // data is an array of arrays
        console.log(data);
    });*/
});
app.post('/participant',function(req, res){
    console.log(req.body);
    var qrMSG = req.body.Name+" "+req.body.Company+" "+req.body.Depart+" "+req.body.Title;
    var qr = qrCode.qrcode(4, 'M');
    qr.addData(qrMSG);
    qr.make();
    var qrimgtag = qr.createTableTag(4);
    //var idx=qrimgtag.indexOf("base64,") + 7;
    // qrimgtag  = qrimgtag.substring(idx);
    //idx = qrimgtag.indexOf('\"');
    //console.log(qrimgtag.substring(0,idx));
  //return qrimgtag.substring(0,idx);
    res.send({title:'QRCODE', qrcodeURL:qrimgtag});
});


var binPath = phantomjs.path;
var childArgs = [
    path.join(__dirname, '/public/rasterize.js http://localhost:3000/pdf ./test.pdf A4')
];

app.get('/convertPdf',function(req, res){   //convertPdf 요청이 오면 phantomJS url/pdf 를 촬영한다.
    child_process.execFile(binPath, childArgs, function(err, stdout, stderr) {
        // handle results
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    })
});

app.get('*', routes.index);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
