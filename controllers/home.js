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
    }
};