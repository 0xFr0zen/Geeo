$(document).ready(function () {
    const cashier = $("#cashier");
    const scanner = cashier.find("#scanner");
    scanner.on('click', () => {
        $(".mode#scan").fadeOut('fast', function () {
            $(".mode#display").fadeIn('fast');
        });
    });

});