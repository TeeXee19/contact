var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var nodemailer = require('nodemailer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/contactus', function(req, res){
	var mailOpts, smtpTrans;
	smtpTrans = nodemailer.createTransport("smtp://tochukwu.franklin.ene@gmail.com:teecee19@smtp.gmail.com");
	//Mail options
	mailOpts = {
		from: req.body.name + req.body.email,
		to: 'teec3000@gmail.com',
		subject: req.body.email + ' --Msg from contactus-form',
		text: "Name:" + req.body.name + "Email" + req.body.email + "QUERY: " + req.body.message
	};
	smtpTrans.sendMail(mailOpts, function (error, response) {
		if (error) {
			res.render('contactus', {msg: 'Error occured, message not sent.', err: true});
			console.log('Message not sent!' + req.body.message);
		}
		else{
			res.render('contactus', {msg: 'Message sent!', err: false});
			console.log('Message sent!' + req.body.message);
		}
		smtpTrans.close();
	});
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
