/***************************************
** Author: Zach Reed
** Description: c_search script
****************************************/

function search_characters() {
	var search_str = document.getElementById('name_search_string').value;
	window.location = '/c_browse/search/' + encodeURI(search_str);
}