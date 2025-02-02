var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'abcmontessoricontact@gmail.com', // Your email id
        pass: 'ContactAbcMont' // Your password
    }
});

module.exports = {
    send: function (req, res) {
        var mailOptions = {
            from: 'abcmontessoricontact@gmail.com', // sender address
            to: 'admin@kidsacademy.co.in', // list of receivers
            subject: 'Website Enquiry', // Subject line
            // text: text //, // plaintext body
            html: '<b>' + req.body.name + '</b> is interested in <b>' + req.body.center + '</b>. <br><p><i>' + req.body.message +
                '</i></p><br><br><b>You can contact </b>  <a href=' + req.body.email + '>' + req.body.email +'</a> for more details'// You can choose to send an HTML body instead
        };

        var replyOptions = {
            from: 'abcmontessoricontact@gmail.com', // sender address
            subject: 'Thanks for Enquiry!',
            to: req.body.email,
            html: '<b>Dear ' + req.body.name + ',</b><br>'+
               '<p>Thanks for showing interest.</p><p>We will get back to you shortly.</p><br>'+
               '<i> - Kids Academy</i>'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                transporter.sendMail(replyOptions);
                res.json({ error: error });
            } else {
                console.log('Message sent: ' + info.response);
                transporter.sendMail(replyOptions);
                res.json("success");
            };
        });

    }
};