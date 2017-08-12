var path = require('path'),
    exphbs = require('express-handlebars'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    routes = require('./../router/routes'),
    output = require('./../middleware/output'),
    MongoStore = require('connect-mongo')(session);
multer = require('multer');

module.exports = function (app) {
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ 'extended': true }));
    app.use(bodyParser.json());

    app.use(multer({
        dest: path.join(__dirname,
            'public/upload/temp')
    }).any());
    app.use(methodOverride());
    app.use(cookieParser());

    var dbURL = 'mongodb://localhost:27017/kidsAcademy';
    if (app.get('env') == 'live') {
        // prepend url with authentication credentials //
        dbURL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + dbHost + ':' + dbPort + '/' + dbName;
    }
    app.use(session({
        secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
        //proxy: true,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false, maxAge: 1800000},
        store: new MongoStore({ url: dbURL })
    })
    );
    output(app);
    routes(app);//moving the routes to routes folder.

    app.use(function (req, res, next) {
        res.setHeader("Cache-Control", "public, max-age=3600");
        return next();
    });

    // app.use(gzippo.staticGzip("" + __dirname + "/dist", {
    //   clientMaxAge: 3600 * 1000 // 1 hour, it seems gzippo takes milliseconds, not seconds
    // }));

    app.use('/', express.static(path.join(__dirname,
        '../public')));

    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }

    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function (timestamp) {
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');

    return app;
};