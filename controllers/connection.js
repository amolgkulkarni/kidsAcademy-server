var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/kidsAcademy');
mongoose.connection.on('open', function () {
    console.log('Mongoose connected.');
});
module.exports = {
    getConnection: function(){
        return mongoose;
    }
};