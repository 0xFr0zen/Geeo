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
    $("#form").on("submit", function (e) {
        e.preventDefault();
        // console.log(data);
        let uname = $("#form input[name='username']").val();
        let pwd = $("#form input[name='password']").val();
        if (uname.length > 0 && pwd.length > 0) {
            // $.post("/login", { username: uname, password: pwd }, function (data, status, xhr) {
            //     if (status === 'success') {

            //         document.location.href = "/";
            //     } else {

            //         document.location.href = "/login";
            //     }
            // });
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch($(this).attr('action'), {
                method: 'POST',
                // mode: 'same-origin',
                redirect: 'follow',
                credentials: 'include', // Don't forget to specify this if you need cookies
                headers: headers,
                body: JSON.stringify(

                    { username: uname, password: pwd }

                )
            })
                .then((value) => {
                    if (value.ok) {
                        document.location.href = "/";

                    } else {

                        document.location.href = "/login";

                    }
                })
                .catch(e => console.error(e))
                .finally(() => {
                    console.log("request done.")
                });
        } else {

        }

    });
    $("#signup").on('click', function () {

    });
});