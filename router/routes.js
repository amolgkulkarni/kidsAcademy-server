var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    image = require('../controllers/image');
    mail = require('../controllers/mail');
    am = require('../controllers/account-manager');

module.exports = function (app) {
    //router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/comment', image.comment);

    router.get('/login', home.login);
    router.post('/api/v1/sendMail', mail.send);
    router.get('/api/v1/images/:cat/:subcat', image.gallery);
    router.post('/api/v1/images', image.create);
    router.post('/api/v1/login', am.manualLogin);
    router.post('/api/v1/addUser', am.addNewAccount);

    app.use(router);
};