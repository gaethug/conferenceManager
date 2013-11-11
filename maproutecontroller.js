exports.mapRoute = function (app, prefix) {
    console.log("prefix:" + prefix);
    prefix = '/' + prefix;
    var prefixObj = require('./controllers' + prefix);

    app.get(prefix, prefixObj.index);


    // show
    app.get(prefix + '/:id', prefixObj.show);

    // create
    app.post(prefix, prefixObj.create);

    // update
    app.put(prefix + '/:id', prefixObj.update);

    // destroy
    app.del(prefix + '/:id', prefixObj.destroy);

    //etc
    switch (prefix) {
        case "/members":
            app.get(prefix+"/:id/:childName", prefixObj.showDetail);
            break;
    }

};
