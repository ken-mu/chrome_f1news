var checkCount = 0;
var defaultCheckCount = 0;
var defaultRowValue = 0;
var defaultcheckedList;
var newsIDArr = new Array();

function init() {
	setRowSelection();
	setNewsCheckBoxs();
	setDefaultRowValue();
	//setDefaultNewsSelect();
	makeNewsIDArr();
}

function setRowSelection() {
	$('row').value = getJsonValue('row');
}

/**
 * 
 */
function setNewsCheckBoxs() {
	var newsarr = getJsonValue('news');
	defaultcheckedList = new Array();
	if(newsarr) {
		for(var i=0; i<newsarr.length; i++) {
			$(newsarr[i]['id']).checked = true;
			//defaultcheckedList[i] = newsarr[i]['id'];
			setDefaultNewsSelect(newsarr[i]['id']);
		}
		checkCount = newsarr.length;
		defaultCheckCount = newsarr.length;
	} else {
		defaultNewsSelect();
		checkCount = 2;
		defaultCheckCount = 2;
	}
}

/**
 * デフォルトはAUTOSPORTとFormula1.comを選択
 */
function defaultNewsSelect() {
	saveRowSelection();
	$('autosport').checked = true;
	$('formula1').checked = true;
	saveNewsCheckBoxs();
}

function setDefaultNewsSelect(id) {
	/*
	var newslist = document.getElementsByClassName('news_checkbox');
	for(var i in newslist) {
		defaultcheckedList.push(newslist[i]['id']);
	}
	*/
	defaultcheckedList.push(id);
}

function setDefaultRowValue() {
	defaultRowValue = getJsonValue('row');
}

function enableSaveButton() {
	hideSaveSuccessMessage();
	$('save_button').disabled = false;
}

function disableSaveButton() {
	$('save_button').disabled = true;
}

function manageRowSelection() {
	if(checkCount > 0 && defaultRowValue != $('row').value) {
		//enableSaveButton();
		//変更
		saveOptions();
	} else {
		//disableSaveButton();
		return;
	}
}

function manageCheckCount(id) {

	if($(id).checked) {
		checkCount++;
	} else {
		checkCount--;
	}

	if(checkCount == 0 || isSameStateAsDefault()) {
		//変更
		//disableSaveButton();
		return;
	} else {
		//enableSaveButton();
		saveOptions();
	}
}

function isSameStateAsDefault() {
	var newsMap = {};
	var newslist = document.getElementsByClassName('news_checkbox');
	for(var i=0; i<newslist.length; i++) {
		newsMap[newslist[i].id] = newslist[i].checked;
	}

	for(var i=0; i<defaultcheckedList.length; i++) {
		if(newsMap[defaultcheckedList[i]] == false) {
			return false;
		}
	}
	return checkCount == defaultCheckCount;
}

function saveOptions() {
	saveRowSelection();
	saveNewsCheckBoxs();
	//変更
	//disableSaveButton();
	//displaySaveSuccessMessage();
}

function saveRowSelection() {
	setJsonKeyValue('row', JSON.stringify($('row').value));
	defaultRowValue = $('row').value;
}

function saveNewsCheckBoxs() {
	var newslist = document.getElementsByClassName('news_checkbox');
	var newsarr = new Array();
	var defaultcheckedlist = new Array();
	for(var i=0; i<newslist.length; i++) {
		if(newslist[i].checked) {
			newsarr.push({'id': newslist[i].id, 'value': newslist[i].value});
			defaultcheckedlist.push(newslist[i].id);
		}
	}
	defaultCheckCount = newsarr.length;
	setJsonKeyValue('news', JSON.stringify(newsarr));
}

function makeNewsIDArr() {
	var newslist = document.getElementsByClassName('news_checkbox');
	
}

function displaySaveSuccessMessage() {
	$('save_succeed').className='';
}

function hideSaveSuccessMessage() {
	$('save_succeed').className='disp_non';
}

