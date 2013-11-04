
/*
 * GET home page.
 */
var userRoles =  require('../public/javascripts/routingConfig').userRoles;
exports.index = function(req, res){
    console.log("index");
    if(req.user){
        res.cookie('user', JSON.stringify(req.user));
    }else{
        res.cookie('user', JSON.stringify({role:userRoles.public}));
    }

    res.sendfile('public/index.html');
};
exports.pdf = function(req, res){
    console.log("index");
    res.sendfile('public/pdf.html');
};
exports.fragments = function (req, res) {
    console.log(req.params.type);
    console.log(req.params.name);
    res.sendfile('public/view/'+req.params.type+'/'+ req.params.name+".html");
};