/***************************************
** Author: Zach Reed
** Description: c_update script
****************************************/

function update_quest_char(id) {
	$.ajax({
		url: '/qc_browse/' + id,
		type: 'PUT',
		data: $('#update_quest_char_form').serialize(),
		success: function(result) {
			window.location.replace("./");
		}
	})
};