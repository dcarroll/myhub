var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('../lib/hubutils');

/* GET users listing. */
//router.get('/', function(req, res) {
//  res.send('respond with a resource');
//});

var harmony = require('harmonyhubjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  listActivities(req, res, next);
});


function listActivities(req, res, next) {
	console.log("Listing activities...");
	fs.exists('commands.json', function(exists) {
		if (!exists) {
			util.initCommands(function() {
				util.loadCommandFile(function(acts) {
					res.render('user', {"title":"Activity List", "activities":parseActivitySummary(acts)});
					return true;
				})
			});
		}
		util.loadCommandFile(function(acts) {
			res.render('user', {"title":"Activity List", "activities":parseActivitySummary(acts)});
		})
	})
};

function parseActivitySummary(activities) {
	var activityList = [];
	activities.forEach(function(activity) {
		if (activity.isAVActivity) {
			activityList.push({ "label":activity.label, "id":activity.id });
		}
	}, this);
	return activityList;
};

module.exports = router;
