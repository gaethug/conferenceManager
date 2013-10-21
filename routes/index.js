
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log("index");
    res.sendfile('public/index.html');
};
exports.fragments = function (req, res) {
    console.log(req.params.type);
    console.log(req.params.name);
    res.sendfile('public/view/'+req.params.type+'/'+ req.params.name+".html");
};