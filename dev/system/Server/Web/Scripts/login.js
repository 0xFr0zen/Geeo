$(document).ready(function () {
    $("#form > input").on('keyup', function () {
        let signupShow = true;
        $("#form > input[required]").each(function (index, elem) {
            signupShow = $(elem).val().length == 0;
        });
        if (signupShow) {
            $("#signup").show();
        } else {
            $("#signup").hide();
        }
    });
    $("#form > input[name='username']").focus();
    $("#signup").on('click', function () {

    });
});