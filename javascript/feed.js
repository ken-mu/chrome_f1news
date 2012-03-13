var reqs;
var row = 0;
var feedURLs = {};
var requestCompletedCount = 0;
var feeds = new Array();
var isConnected = true;

// id="news"�̃G�������g�z��
var newsarr;


function main() {
	init();
	makeFeedURLs();
	defineRequests();
}

/**
 * �����̃t�B�[�h���擾����B
 * 
 */
function makeFeedURLs() {
	if(! newsarr) {
		newsarr = [{id: 'autosport', value: 'http://www.autosport.com/rss/f1news.xml'},
							 {id: 'formula1', value: 'http://www.formula1.com/rss/news/latest.rss'}];
	}
	for(var i in newsarr) {
		feedURLs[newsarr[i].id] = newsarr[i].value;
	}
}

/**
 * ���ׂẴt�B�[�h�ɑ΂����͂�����������A�f�[�^���擾�B
 */
function defineRequests() {
	reqs = new Array(newsarr.length);
	for(var i in feedURLs) {
		reqs[i] = new XMLHttpRequest();
		defineRequest(reqs[i], feedURLs[i]);
	}
}

/**
 * ���Ԏ��Ńt�B�[�h���\�[�g����B
 * ���Ԏ��̌`����<pubDate>Www, d{1,2} Mmm yyyy hh:mm:ss [GMT|+dddd]</pubDate>
 * �ȉ��̏��ɒ��ׂ�B
 * 1. �N(yyyy)
 * 2. ��(Mmm)
 * 3. ��(dd)
 * 4. ��(hh)
 * 5. ��(mm)
 * 6. �b(ss)
 */
function sortFeeds() {
	feeds.sort(function(feed1, feed2) {
		if(feed1['pubdate']['year'] != feed2['pubdate']['year']) {
			return feed2['pubdate']['year'] - feed1['pubdate']['year'];
		} else if(feed1['pubdate']['month'] != feed2['pubdate']['month']) {
			return getMonthCompareValue(feed1['pubdate']['month'], feed2['pubdate']['month']);
		} else if(feed1['pubdate']['day'] != feed2['pubdate']['day']) {
			return feed2['pubdate']['day'] - feed1['pubdate']['day'];
		} else if(feed1['pubdate']['hour'] != feed2['pubdate']['hour']) {
			return feed2['pubdate']['hour'] - feed1['pubdate']['hour'];
		} else if(feed1['pubdate']['minute'] != feed2['pubdate']['minute']) {
			return feed2['pubdate']['minute'] - feed1['pubdate']['minute'];
		} else {
			return feed2['pubdate']['second'] - feed1['pubdate']['second'];
		}

	});
}

function getMonthCompareValue(month1, month2) {
	return months['month2'] - months['month1'];
}

function getPubDates(pubdate) {
	var pubdates = pubdate.match(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat|dom|lun|mar|mie|jue|vie|sab), (\d{1,2}) ([A-Za-z]{3}) (\d{4}) (\d{2}):(\d{2}):*(\d{0,2})/);
	if(pubdates == undefined) {
		alert(pubdate);
	}

	if(pubdates[7] == "") {
		pubdates[7] = "0";
	}

	return {
		'year': getNumber(pubdates[4]),
		'month': pubdates[3],
		'day': getNumber(pubdates[2]),
		'hour': getNumber(pubdates[5]),
		'minute': getNumber(pubdates[6]),
		'second': getNumber(pubdates[7])
	};
}

function getNumber(str) {
	return parseInt(str.match(/^[0]*([A-Za-z0-9]{1,4}$)/)[1]);
}

function defineRequest(req, feedURL) {
	req.open('GET', feedURL, true);
	req.onload = handleResponse();
	req.onreadystatechange = function() {
		/**
		 * req�̃t�B�[�h�̓ǂݍ��݂�����������A
		 * �e�t�B�[�h�̃^�O�𒊏o���A
		 * �S�t�B�[�h�̓ǂݍ��݂�����������A���Ԏ��Ń\�[�g����B
		 */
		if(req.readyState == 4) {
			requestCompletedCount++;
			
			if(!isConnected) {
				$('loading').style.display = 'none';
				return;
			}
			checkHttpStatusCode(req);
	
			if(requestCompletedCount == reqs.length) {
				sortFeeds();
				$('loading').style.display = 'none';
				showFeeds();
			}
		}
	}
	req.send(null);
}

function checkHttpStatusCode(req) {
	if(req.status == 200) {
		makeFeed(req);
	} else if(req.status == 404) {
		showHttpStatusMessage('Not found.');
	} else if(req.status == 0) {
		showHttpStatusMessage('Not connected.');
		isConnected = false;
	}
}

function showHttpStatusMessage(message) {
	var child = document.createElement('p');
	child.innerText = message;
	$('httpstatus').appendChild(child);
}

function makeFeed( req ) {
	var response = req.responseXML;
	var feed_title = response.getElementsByTagName('title')[0].textContent;
	var items = response.getElementsByTagName('item');
	for(var i=0; i<items.length; i++) {
		var item = document.createElement('div');
		item.className = 'item'

		var title = document.createElement('div');
		title.className = 'title';

		var title_a = document.createElement('a');
		title_a.target="_blank";
		title_a.innerText = getInnerSubItem(items[i], 'title');
		var link = getInnerSubItem(items[i], 'link');
		title_a.href = link;

		var source = document.createElement('div');
		source.className = 'source';

		var source_a = document.createElement('a');
		source_a.target = "_blank";
		if(feed_title) {
			source_a.innerText = feed_title;
		} else {
			source_a.innerText = "No Title";
		}
		source_a.href = link;

		item.appendChild(title);
		title.appendChild(title_a);
		item.appendChild(source);
		source.appendChild(source_a);

		feeds.push({'item': item, 'pubdate': getPubDates(getInnerSubItem(items[i], 'pubDate'))});
	}
}

function getInnerSubItem(item, tag) {
	subitem = item.getElementsByTagName(tag)[0].textContent
	if(subitem) {
		return item.getElementsByTagName(tag)[0].textContent;
	}
	alert(tag + " is not found.");
	return null;
}

function showFeeds() {
		var feed = $("feed");
		if(!row) {
			row = 10;
		}
		for(var i=0; i<row; i++) {
			feed.appendChild(feeds[i]['item']);
		}
}

function init() {
	$('loading').style.display = "";
	requestCompletedCount = 0;
	clearFeed();
	row = getJsonValue('row');
	newsarr = getJsonValue('news');
}

function clearFeed() {
	$("feed").innerHTML = "";
}

function handleResponse() {
}
