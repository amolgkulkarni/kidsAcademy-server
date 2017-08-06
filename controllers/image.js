var fs = require('fs'),
    path = require('path');

var Mongoose = require('./connection');
var Image = new Mongoose.getConnection().Schema({
    src: { type: String },
    title: { type: String },
    description: { type: String },
    category: { type: String },
    subcategory: { type: String }
});

var ImageModel = Mongoose.getConnection().model('Image', Image);
var baseUrl = '/api/v1/images/';

// var db, MongoClient = require('mongodb').MongoClient;

// MongoClient.connect('mongodb://localhost:27017/kidsAcademy',
//     function (err, database) {
//         if (database) {
//             db = database;
//         }
//     });

module.exports = {
    index: function (req, res) {
        res.render('image');
    },
    gallery: function (req, res) {
        var conf = req.originalUrl.replace(baseUrl, '').split('/');
        ImageModel.find({ category: conf[0], subcategory: conf[1] }, function (err, images) {
            if (images && images.length) {
                res.send(images);
            } else {
                res.json(500, { error: 'No images found' });
            }
        });
    },
    create: function (req, res) {
        if (req.session.user.admin != true) {
            res.json(500, { error: 'You are not allowed to upload.' });
        }
        var saveImage = function () {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';

            for (var i = 0; i < 6; i += 1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            var tempPath = req.files[0].path,
                ext = path.extname(req.files[0].originalname).toLowerCase(),
                targetPath = path.resolve('./public/assets/gallery/' + imgUrl + ext);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext ===
                '.gif') {

                ImageModel.find({ src: 'assets/gallery/' + imgUrl + ext }, function (err, images) {
                    if (images && images.length) {
                        saveImage();
                    } else {
                        var newUser = new ImageModel({
                            src: 'assets/gallery/' + imgUrl + ext,
                            title: req.body.title,
                            category: req.body.category,
                            subcategory: req.body.subcategory,
                            description: req.body.description
                        });
                        newUser.save(function (err, product, numAffected) {
                            if (err) { throw err; }
                            fs.rename(tempPath, targetPath, function (err) {
                                if (err) throw err;
                                res.send('The image:create POST controller');
                            });

                        });
                    }
                });
            } else {
                fs.unlink(tempPath, function () {
                    if (err) throw err;
                    res.json(500, { error: 'Only image files are allowed.' });
                });
            }

        }
        saveImage();
    },
    like: function (req, res) {
        res.send('The image:like POST controller');
    },
    comment: function (req, res) {
        res.send('The image:comment POST controller');
    },
    getConnection: function (req, res) {
        res.send('The image:comment POST controller');
    }
};