var express = require('express');
var router = express.Router();
var harmony = require('harmonyhubjs');
var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/reset', function(req, res) {
	harmony('10.0.0.9')
	.then(function(harmonyClient) {
		harmonyClient.getActivities()
		.then(function(activities) {
			fs.writeFileSync('commands.json', JSON.stringify(activities), activities, 'utf-8');
			res.send('ok');
			return true;
		})
	});
})

module.exports = router;
