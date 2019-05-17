function update_region(id) {
    var confirm_update = confirm("Are you sure you want to update?");
    if(confirm_update){
        
        $.ajax({
            url: '/customers/'+ id,
            type: 'PUT',
            data: $('#r_update').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("hello");
            }
        });
