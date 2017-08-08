var moment = require('moment');
module.exports = {
    index: function (req, res) {

        var viewModel = {
            images: [
                {
                    uniqueId: 1,
                    title: 'Sample Image 1',
                    description: "...... Sample .......",
                    filename: "sample1.jpg",
                    views: 0,
                    likes: 5,
                    timestamp: Date.now
                }, {
                    uniqueId: 2,
                    title: "Sample Image 2",
                    description: "........ next sample .......",
                    filename: "sample2.jpg",
                    views: 6,
                    likes: 1,
                    timestamp: Date.now
                }],
            helpers: {
                timeago: function (timestamp) {
                    return moment(timestamp).startOf('minute').fromNow();
                    //return "Few moments ago."
                }
            }
        };
        res.render('index', viewModel);
    },

    login: function (req, res) {
        //res.header("Access-Control-Allow-Origin", "*");
        // check if the user's credentials are saved in a cookie //
        if (req.cookies.user == undefined || req.cookies.pass == undefined) {
            res.status(200).send({data: 'logout'});
        } else {
            // attempt automatic login //
            AM.autoLogin(req.cookies.user, req.cookies.pass, function (o) {
                if (o != null) {
                    req.session.user = o;
                    res.status(200).send({data: 'Logged In automatically.'});
                } else {
                    res.status(200).send({data: 'timeout'});
                }
            });
        }
    }
};