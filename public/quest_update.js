/***************************************
** Author: Zach Reed
** Description: c_update script
****************************************/

function update_quest(id) {
	$.ajax({
		url: '/q_browse/' + id,
		type: 'PUT',
		data: $('#update_quest_form').serialize(),
		success: function(result) {
			window.location.replace("./");
		}
	})
};