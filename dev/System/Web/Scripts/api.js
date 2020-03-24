$(document).ready(function() {
    $('.tab').on('click', function(e) {
        let page = $(this).attr('page');
        $.get(`/sections/${page}`, (data, s, x) => {
            $('#section').empty();
            $('#section').append(data);
        });
    });
});
