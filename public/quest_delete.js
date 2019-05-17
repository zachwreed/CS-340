/***************************************
** Author: Zach Reed
** Description: q_update script
****************************************/

function delete_quest(id) {
	$.ajax({
		url: '/q_browse/' + id,
		type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
	})
};