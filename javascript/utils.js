var row = 10;

var months = {
	'Jan': 1,
	'Feb': 2,
	'Mar': 3,
	'Apr': 4,
	'May': 5,
	'Jun': 6,
	'Jul': 7,
	'Aug': 8,
	'Sep': 9,
	'Oct': 10,
	'Nov': 11,
	'Dec': 12
};

function $(elementId) {
  return document.getElementById(elementId);
}

function setJsonKeyValue(key, value) {
	window.localStorage.setItem(key, value);
}

function getJsonValue(key) {
	return JSON.parse(window.localStorage.getItem(key));
}

function jsonTest(key) {
	var list = getJsonValue(key);
	alert(list);
}

function arrayTest(arr) {
	for(var i in arr) {
		alert(arr[i]);
	}
}
