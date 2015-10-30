function mute() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/volume", true);
	xhr.send();
}