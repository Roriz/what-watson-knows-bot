const TelegramBot = require('node-telegram-bot-api-latest'),
	fs = require('fs-extra'),
	_ = require('lodash'),
	path = require('path'),
	request = require('request'),
	i18n = require("i18n"),
	express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3'),
	config = JSON.parse(fs.readFileSync('config/development.json', 'utf8'));

config.telegram.file_path = config.telegram.file_path + config.telegram.token;
var usersConfig = [];
var chatIdDeveloper = 124872660;

var visual_recognition = new VisualRecognitionV3({
	api_key: 'b830a5f0b38dac7a518f0065581a8052c33e9c09',
	version_date: '2016-05-19'
});

// ------------------------------------------ INITIALIZE AND CONFIG DEFAULT PLUGINS
// Setup polling way
var bot = new TelegramBot(config.telegram.token, {
	polling: true
});


i18n.configure({
	updateFiles: true,
	syncFiles: true,
	locales: ['en', 'pt'],
	defaultLocale: 'en',
	directory: path.resolve(__dirname, config.i18n.folder),
	api: {
		'__': 't', //now req.__ becomes req.t 
	}
});


console.log("App started!");
bot.on('message', (msg) => {
	console.log("Message has sended by ", msg.from.first_name + " " + msg.from.last_name);
	bot.sendMessage(chatIdDeveloper, "Message has sended by " + msg.from.first_name + " " + msg.from.last_name);

	if (!usersConfig[msg.from.id]) {
		usersConfig[msg.from.id] = msg.from;

		bot.getUserProfilePhotos(msg.from.id).then((photos) => {
			responseImage(_.first(photos.photos), msg.from.id);
		}).catch((err) => {
			console.log("err", err);
		});

		bot.sendMessage(msg.chat.id, "Just a little bit, watson is processing your profile.");
	} else {

		if (msg.photo && msg.photo.length > 0) {
			bot.sendMessage(msg.chat.id, "Just a little bit, watson is processing the photo.");
			responseImage(msg.photo, msg.from.id);
		} else {
			bot.sendMessage(msg.chat.id, "Now, you can send me a photo so I can analyze.");
		}
	}

	if (msg.location) {
		usersConfig[msg.from.id].location = msg.location;
	}
});

var getPhoto = function(file) {
	if (_.isArray(file)) {
		file = _.last(file);
	}

	return new Promise((onSuccess, onError) => {
		bot.getFile(file.file_id)
			.then((photo) => {
				request({
					url: config.telegram.file_path + '/' + photo.file_path,
					encoding: null
				}, function(error, response, body) {
					onSuccess(body);
				});
			}).catch((err) => {
				console.log("err", err);
			});
	});
}

var detectFaces = function(file) {
	return new Promise((onSuccess, onError) => {
		visual_recognition.detectFaces({
			images_file: file
		}, function(err, res) {
			if (err) {
				return console.log(err);
			}
			onSuccess(res);
		});
	});
}

var responseInText = function(res, chatId) {
	var txt = "";
	var faces = _.first(res.images).faces;
	txt += "Watson found *" + faces.length + "* faces."
	_.each(faces, function(face, key) {
		txt += "\nIn face *" + (key + 1) + "*, a *" + face.gender.gender + "* (Changes of " + parseInt(face.gender.score * 100) + "%) of *" + face.age.min + "* to *" + face.age.max + "* years was found (Changes of " + parseInt(face.age.score * 100) + "%).";
	});
	bot.sendMessage(chatId, txt, {
		parse_mode: 'Markdown'
	});
}

var responseImage = function(image, chatId) {
	getPhoto(image).then((file) => {
		detectFaces(file).then(function(res) {
			responseInText(res, chatId);
		}).catch((err) => {
			console.log("err", err);
		});
	}).catch((err) => {
		console.log("err", err);
	});
}





var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('/', function(req, res) {
	res.render('index.html', {
		title: 'Cloudant Boiler Plate'
	});
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});