
/*
 * GET home page.
 */
exports.index = function(req, res){
    console.log("index");
    if(req.user){
        console.log(req.user.Name);
        res.cookie('user', escape(JSON.stringify(req.user)));
    }else{
        res.cookie('user', escape(JSON.stringify({})));
    }
    res.sendfile('public/index.html');
};
exports.pdf = function(req, res){
    console.log("index");
    res.sendfile('public/pdf.html');
};
exports.fragments = function (req, res) {
    if(req.user){
        console.log(req.user.Name);
        res.cookie('user', escape(JSON.stringify(req.user)));
    }else{
        res.cookie('user', escape(JSON.stringify({})));
    }
    console.log(req.params.type);
    console.log(req.params.name);
    res.sendfile('public/view/'+req.params.type+'/'+ req.params.name+".html");
};