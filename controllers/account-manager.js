var crypto = require('crypto');
var Mongoose = require('./connection'),
    Account = new Mongoose.getConnection().Schema({
        name: { type: String },
        pass: { type: String },
        email: { type: String },
        admin: { type: Boolean },
        active: { type: Boolean }
    });

var AccountModel = Mongoose.getConnection().model('Account', Account);

var md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

var validatePassword = function (plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
};
var generateSalt = function () {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};
var saltAndHash = function (pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
}

module.exports = {
    autoLogin: function (email, pass, cb) {
        AccountModel.findOne({ email: email, active: true }, function (e, o) {
            if (o) {
                o.pass == pass ? cb(o) : cb(null);
            } else {
                cb(null);
            }
        });
    },

    manualLogin: function (req, res) {
        AccountModel.findOne({ email: req.body.email }, function (e, o) {
            if (o == null || o.active !== true) {
                res.status(400).send(e);
            } else {
                validatePassword(req.body.pass, o.pass, function (err, valid) {
                    if (valid) {
                        req.session = req.session || {};
                        req.session.user = o;
                        //req.session.save();
                        if (req.body['remember-me'] == 'true') {
                            res.cookie('email', o.email, { maxAge: 900000 });
                            res.cookie('pass', o.pass, { maxAge: 900000 });
                        }
                        res.status(200).send({name: o.name, admin: o.admin});
                    } else {
                        res.status(400).send(err);
                    }
                });
            }
        });
    },

    addNewAccount: function (req, res) {
        if (!req.session.user.admin) {
            res.status(400).send('Not allowed');
        }
        var newData = {
            name: req.body['name'],
            email: req.body['email'],
            pass: req.body['pass'],
            admin: req.body['admin']
        }
        AccountModel.findOne({ email: newData.email }, function (e, o) {
            if (o) {
                res.status(400).send({data: 'duplicate'});
            } else {
                saltAndHash(newData.pass, function (hash) {
                    newData.pass = hash;
                    newData.active = true;
                    var newUser = new AccountModel(newData);
                    newUser.save(function (e) {
                        if (e) {
                            res.status(400).send(e);
                        } else {
                            res.status(200).send({data: 'ok'});
                        }
                    });
                });
            }
        });
    }
};