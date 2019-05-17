/***************************************
** Author: Zach Reed
** Description: q_update script
****************************************/

function delete_quest_char(id) {
	$.ajax({
		url: '/qc_browse/' + id,
		type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
	})
};