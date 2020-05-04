$(document).ready(() => {
    ResourceLoader(() => {
        let pastHistoryContainer = $('.history .past');

        let currencySelector = $('#currency #selector');
        currencySelector.on('change', (e) => {
            let value = $(e.target).val();
            console.log(value);
        });
        $('#items .item .information').each((index, elem) => {
            $(elem).on('click', (e) => {
                $('#items .item').each((index, elem2) => {
                    if (elem2 != $(elem).parent()[0]) {
                        $(elem2).removeClass('open');
                    }
                });
                $(elem).parent().toggleClass('open');
            });
        });
        $('#cashiermain').hide();

        

        return true;
    }).then((e) => {
        setTimeout(() => {
            $('#cashiermain').show();
        }, 500);
    });
});
