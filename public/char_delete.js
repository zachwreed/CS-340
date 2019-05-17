/***************************************
** Author: Zach Reed
** Description: c_delete script
****************************************/

function delete_character(id) {
	$.ajax({
		url: '/c_browse/' + id,
		type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
	})
};