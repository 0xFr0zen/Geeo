$(document).ready(function() {
    $('#form > input').on('keyup', function() {
        let signupShow = true;
        $('#form > input[required]').each(function(index, elem) {
            signupShow = $(elem).val().length == 0;
        });
        if (signupShow) {
            $('#signup').show();
        } else {
            $('#signup').hide();
        }
    });
    $("#form > input[name='username']").focus();

    $('#form').on('submit', function(e) {
        e.preventDefault();
        let url = $(this).attr('action') + "?" + $(this).serialize();
        console.log("url", url);
        
        $.post(url, (data, status, xhr) => {
            if(data.ok === true){
                // console.log(data);
                
                document.location.href = "/";
            }
            
        });
    });
    $('#signup').on('click', function() {});
});
