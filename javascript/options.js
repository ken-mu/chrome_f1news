var checkcount = 0;
var defaultcheckcount = 0;
var defaultRowValue = 0;
var defaultcheckedarr;
var newsidarr;
var timer = getCheckStatusInterval(5000);

function init() {
	newsidarr = makeNewsIDArr();
	setRowSelection();
	setNewsCheckBoxs();
	setDefaultRowValue();
	//setDefaultNewsSelect();
	//makeNewsIDArr();
}

function setRowSelection() {
	$('row').value = getJsonValue('row');
}

function setNewsCheckBoxs() {
	var newsarr = getJsonValue('news');
	defaultcheckedarr = new Array();
	if(newsarr) {
		for(var i=0; i<newsarr.length; i++) {
			$(newsarr[i]['id']).checked = true;
			//defaultcheckedarr[i] = newsarr[i]['id'];
			setDefaultNewsSelect(newsarr[i]['id']);
		}
		checkcount = newsarr.length;
		defaultcheckcount = newsarr.length;
	} else {
		defaultNewsSelect();
		checkcount = 2;
		defaultcheckcount = 2;
	}
}

function defaultNewsSelect() {
	saveRowSelection();
	$('autosport').checked = true;
	$('formula1').checked = true;
	saveNewsCheckBoxs();
}

function setDefaultNewsSelect(id) {
	defaultcheckedarr.push(id);
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
	timer = getCheckStatusInterval(5000);
	if(checkcount > 0 && defaultRowValue != $('row').value) {
		//enableSaveButton();
		saveOptions();
	} else {
		//disableSaveButton();
		return;
	}
}

function manageCheckCount(id) {
	timer = getCheckStatusInterval(5000);
	if($(id).checked) {
		checkcount++;
	} else {
		checkcount--;
	}

	if(checkcount == 0 || isSameStateAsDefault()) {
		//disableSaveButton();
		return;
	} else {
		//enableSaveButton();
		saveOptions();
	}
}

function isSameStateAsDefault() {
	/*
	var newsMap = {};
	var newslist = document.getElementsByClassName('news_checkbox');
	for(var i=0; i<newslist.length; i++) {
		newsMap[newslist[i].id] = newslist[i].checked;
	}
	*/
	var newscheckedmap = getNewsCheckedMap();

	for(var i=0; i<defaultcheckedarr.length; i++) {
		if(newscheckedmap[defaultcheckedarr[i]] == false) {
			return false;
		}
	}
	return checkcount == defaultcheckcount;
}

function saveOptions() {
	saveRowSelection();
	saveNewsCheckBoxs();
	clearInterval(timer);
	//disableSaveButton();
	//displaySaveSuccessMessage();
}

function getCheckStatusInterval(time) {
	return setInterval("checkStatus()", time);
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
	defaultcheckcount = newsarr.length;
	setJsonKeyValue('news', JSON.stringify(newsarr));
}

function makeNewsIDArr() {
	var newsarr = document.getElementsByClassName('news_checkbox');
	var arr = new Array(newsarr.length);
	for(var i=0; i<newsarr.length; i++) {
		arr[i] = newsarr[i].id;
	}
	return arr;
}

function displaySaveSuccessMessage() {
	$('save_succeed').className='';
}

function hideSaveSuccessMessage() {
	$('save_succeed').className='disp_non';
}

/**
 * ストレージのXMLとオプションページの設定を比較。
 * 設定が異なれば、オプションページの状態を、XMLの状態に合わせて再設定する。
 */
function checkStatus() {
	if(! isSameRowValueAsJson() ) {
		$('row').value = getJsonValue('row')
	}

	if(! isSameCheckBoxStatusAsJson() ) {
		resetAllNewsCheckBox();
		setNewsCheckBoxs();
	}
}

function resetAllNewsCheckBox() {
	for(var i=0; i<newsidarr.length; i++) {
		$(newsidarr[i]).checked = false;
	}
}

function isSameRowValueAsJson() {
	return $('row').value == getJsonValue('row');
}

function getNewsCheckedMap() {
	var newsMap = {};
	var newslist = document.getElementsByClassName('news_checkbox');
	for(var i=0; i<newslist.length; i++) {
		newsMap[newslist[i].id] = newslist[i].checked;
	}
	return newsMap;
}

function isSameCheckBoxStatusAsJson() {
	var newsCheckedMap = getNewsCheckedMap();
	var newsarr = getJsonValue('news');
	for(var i=0; i<newsarr.length; i++) {
		if(newsCheckedMap[newsarr[i]['id']] == false) {
			return false;
		}
	}
	return checkcount == newsarr.length;
}
