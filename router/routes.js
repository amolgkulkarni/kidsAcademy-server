var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    image = require('../controllers/image');
    mail = require('../controllers/mail');

module.exports = function (app) {
    //router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/comment', image.comment);

    //router.get('/', home.index);
    router.post('/api/v1/sendMail', mail.send);
    router.get('/api/v1/images/:cat/:subcat', image.gallery);
    router.post('/api/v1/images', image.create);

    app.use(router);
};