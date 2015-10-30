function mute() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/volume", true);
	xhr.send();
}

function start() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/activity/start", true);
	xhr.send();
}

function stop() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/activity/stop", true);
	xhr.send();
}

function volumeUp() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/volume/up", true);
	xhr.send();
}

function volumeDown() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/volume/down", true);
	xhr.send();
}