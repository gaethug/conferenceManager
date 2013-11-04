
/**
 * Module dependencies.
 */
var application_root = __dirname;
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var map = require('./maproutecontroller');
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

var Member = require('./models/member.js');

passport.use(Member.localStrategy);
passport.serializeUser(Member.serializeUser);
passport.deserializeUser(Member.deserializeUser);

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret",
        cookie: {maxAge: new Date(Date.now() + 30000)}
    }));
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


mongoose.connect('mongodb://localhost:27017');
mongoose.connection.on('open', function() {
    console.log('Connected to Mongoose');
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/',routes.index);
app.get('/pdf',routes.pdf);
app.get('/fragments/:type/:name', routes.fragments);

app.get('/excel', function(req, res){
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
});
app.post('/participant',function(req, res){
    console.log(req.body);
    var qrMSG = req.body.Name+" "+req.body.Company+" "+req.body.Depart+" "+req.body.Title;
    var qr = qrCode.qrcode(4, 'M');
    qr.addData(qrMSG);
    qr.make();
    var qrimgtag = qr.createTableTag(4);
    res.send({title:'QRCODE', qrcodeURL:qrimgtag});
});

var prefixes = ['members', 'events', 'surveys', 'emails'];

prefixes.forEach(function(prefix) {
    map.mapRoute(app, prefix);
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
var auth = require('./controllers/authController');
app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/auth/login/success', function(req, res){
    console.log("login SUccess");
    console.log(req.session.passport.user);
    res.send({user:req.session.passport.user , result:"SUCCESS"});
});
app.get('/auth/login/failure', function(req, res){
    console.log("login Fail");
    //console.log(res);
    res.send({result:"FAIL"});
});



app.get('*', routes.index);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
