$(document).ready(function(){
    $("#form").on("submit", function(e){
        e.preventDefault();
        let data = $(this).serialize();
        // console.log(data);
        let uname = $("#form input[name='username']").val();
        let pwd = $("#form input[name='password']").val();
        $.post("/login",{username:uname, password:pwd}, function(data, status, xhr){
            if(status === 'success'){

                document.location.href = "/";
            }else {

                document.location.href = "/login";
            }
        });

    })
});