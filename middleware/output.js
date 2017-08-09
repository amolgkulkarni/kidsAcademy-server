module.exports = function (app) {
app.all('/*', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    // res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Max-Age', '86400');
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    //console.log('.....' + /^((?!\/(api)).)*$/.test(req.originalUrl));
    var spaUrls = ["/music","/contact","/home","/daycare","/school"];
    if(req.originalUrl != '/' && spaUrls.indexOf(req.originalUrl) != -1){
        res.redirect('/');
    } else {
        next();
    }
});
/*
    app.use(function (req, res, next) {
        console.log(" First Custom");
        //next(new Error('Just testing'));
        next();
    });
    app.use(function (req, res, next) {
        console.log("No Errors");
        next();
    }, function (err, req, res, next) {
        console.log("Stack trace");
        console.log(err);
        next(err);
    });
    */
};