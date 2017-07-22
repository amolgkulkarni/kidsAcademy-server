module.exports = function (app) {
app.all('/*', function (req, res, next) {
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