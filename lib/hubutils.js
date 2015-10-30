var fs = require('fs');
var harmony = require('harmonyhubjs');
var commands = require('../commands.json');

var hubutil = {};

hubutil.initCommands = function(callback) {
	fs.exists('commands.json', function(exists) {
		if (!exists) {
			harmony('10.0.0.9')
			.then(function(harmonyClient) {
				harmonyClient.getActivities()
				.then(function(activities) {
					fs.writeFileSync('commands.json', JSON.stringify(activities), activities, 'utf-8');
					if (callback) callback();
					return true;
				});
		});
		}
	});	
}

hubutil.loadCommandFile = function(callback) {
	fs.readFile('commands.json', 'utf-8', function(err, data){
		if (err) throw err;
		var acts = JSON.parse(data);
		callback(acts);
	})
};

hubutil.getActivityById = function(activityId) {
	for (var i=0;i<commands.length;i++) {
		var element = commands[i];
		if (element.id === activityId) {
			return element;
		}
	}
};

hubutil.getActivityByName = function(activityName) {
	for (var i=0;i<commands.length;i++) {
		var element = commands[i];
		if (element.label.toLowerCase() === activityName.toLowerCase()) {
			return element;
		}
	}
};

hubutil.getActivityId = function(activityName) {
	return this.getActivityByName(activityName).id;
};

hubutil.getCommand = function(activityName, commandGroup, commandName) {
	var controlGroup = this.getActivityByName(activityName).controlGroup;
	for (var i=0;i<controlGroup.length;i++) {
		var group = controlGroup[i];
		if (group.name.toLowerCase() === commandGroup.toLowerCase()) {
			// Got the group, now look for the command.
			var func = controlGroup[i].function;
			for (var k=0;k<func.length;k++) {
				var f = func[k];
				if (f.name.toLowerCase() === commandName.toLowerCase() ||
				    f.label.toLowerCase() === commandName.toLowerCase()) {
						return func[k];
				}
			}
		}
	}
};

hubutil.sendCommand = function(activityName, commandGroup, commandName, action) {
	var cmd = this.getCommand(activityName, commandGroup, commandName);
	var cmdBody = cmd; //JSON.stringify(cmd).replace(/\:/g, '::');
	harmony('10.0.0.9')
			.then(function(harmonyClient) {
				harmonyClient.sendCommand(action, "action=" + cmdBody + ":status=press");
			});
};

hubutil.volumeDown = function() {
	this.sendCommand("Tivo Premier", "Volume", "VolumeDown", "holdAction");	
};

hubutil.volumeMute = function() {
	this.sendCommand("Sony AV Receiver", "Volume", "Mute", "holdAction");	
};

module.exports = hubutil;
