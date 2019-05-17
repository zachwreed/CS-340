/***************************************
** Author: Zach Reed
** Description: c_update script
****************************************/

function update_character(id) {
	$.ajax({
		url: '/c_browse/' + id,
		type: 'PUT',
		data: $('#update_char_form').serialize(),
		success: function(result) {
			window.location.replace("./");
		}
	})
};