var fs = require('fs');
var harmony = require('harmonyhubjs');
var commands = require('../commands.json');

var hubutil = {};
var harmonyIp = '10.0.0.9';

hubutil.initCommands = function(callback) {
	fs.exists('commands.json', function(exists) {
		if (!exists) {
			harmony(harmonyIp)
			.then(function(harmonyClient) {
				harmonyClient.getActivities()
				.then(function(activities) {
					fs.writeFileSync('commands.json', JSON.stringify(activities), activities, 'utf-8');
					if (callback) callback();
					harmonyClient.end();
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

hubutil.startActivity = function(activityName) {
	var act = this.getActivityByName(activityName);
	harmony(harmonyIp)
	.then(function(harmonyClient) {
		harmonyClient.startActivity(act.id);
		harmonyClient.end();
	});
};

hubutil.stopActivity = function() {
	harmony(harmonyIp)
	.then(function(harmonyClient) {
		harmonyClient.turnOff();
		harmonyClient.end();
	});
};

hubutil.getActivityByName = function(activityName) {
	for (var i=0;i<commands.length;i++) {
		var element = commands[i];
		if (element.label.toLowerCase() === activityName.toLowerCase()) {
			return element;
		}
	}
};

hubutil.getActivityById = function(activityId) {
	for (var i=0;i<commands.length;i++) {
		var element = commands[i];
		if (element.id === activityId) {
			return element;
		}
	}
};

hubutil.getActivityId = function(activityName) {
	return this.getActivityByName(activityName).id;
};

hubutil.getCommand = function(activity, commandGroup, commandName) {
	var controlGroup = activity.controlGroup;
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

hubutil.getCurrentActivity = function(callback) {
	harmony(harmonyIp)
	.then(function(harmonyClient){
		harmonyClient.getCurrentActivity()
		.then(function(data) {
			callback(data);
			harmonyClient.end();
		});
	});
};

/*hubutil.sendCommand = function(activityName, commandGroup, commandName, action) {
	var cmd = this.getCommand(this.getActivityByName(activityName), commandGroup, commandName);
	//var cmdBody = JSON.stringify(cmd.action); //JSON.stringify(cmd).replace(/\:/g, '::');
	var actiond = JSON.parse(cmd.action);
	var actionString = '{"type"::"' + actiond.type + '","deviceId"::"' + actiond.deviceId + '","command"::"' + actiond.command + '"}';
	
	harmony(harmonyIp)
			.then(function(harmonyClient) {
				harmonyClient.sendCommand(action, "action=" + actionString + ":status=press");
			});
};*/

hubutil.getActivity = function(params, callback) {
	var getact = this.getActivityById;

	if (params.activityName && params.activityId) {
		throw new Error("Cannot specify name and id for activity.");
	}
	var activity;
	if (params.activityName) {
		activity = this.getActivityByName(params.activityName);
		callback(activity);
	} else if (params.activityId) {
		activity = this.getActivityById(params.activityId);
		callback(activity);
	} else {
		var id = this.getCurrentActivity(function(data) {
			activity = getact(data);
			callback(activity);
		});
	}
};

hubutil.sendCommand = function(params) {
	console.log("Sending command...");
	var getCommand = this.getCommand;
	this.getActivity(params, function(activity) {
		console.log("Got activity...");
		var cmd = getCommand(activity, params.commandGroup, params.commandName);
		//var cmdBody = JSON.stringify(cmd.action); //JSON.stringify(cmd).replace(/\:/g, '::');
		var actiond = JSON.parse(cmd.action);
		var actionString = '{"type"::"' + actiond.type + '","deviceId"::"' + actiond.deviceId + '","command"::"' + actiond.command + '"}';
		
		harmony(harmonyIp)
		.then(function(harmonyClient) {
			console.log("Actually sending the command....");
			harmonyClient.sendCommand(params.action, "action=" + actionString + ":status=press")
			console.log("Command sent...");
			harmonyClient.end();
		});
	});
};

hubutil.volumeDown = function() {
	this.sendCommand({ "commandGroup":"Volume", "commandName":"VolumeDown", "action":"holdAction" });	
};

hubutil.volumeUp = function() {
	this.sendCommand({ "commandGroup":"Volume", "commandName":"VolumeUp", "action":"holdAction" });	
};

hubutil.volumeMute = function() {
	this.sendCommand({ "commandGroup":"Volume", "commandName":"Mute", "action":"holdAction" });	
};

module.exports = hubutil;
