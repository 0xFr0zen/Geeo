$(document).ready(function () {
    // loadInventory(username, 'default');
    $('#menu #inventories .inventory').each((index, inventory_button) => {
        let id = $(inventory_button).attr('id');
        if (id !== 'add') {
            $(inventory_button).on('click', function (e) {
                var name = $(this)
                    .children('.name')
                    .attr('invname');
                loadInventory(username, name);
            });
        } else {
            $(inventory_button).on('click', function (e) {
                prompter('Storage name?', 'newStorage').then((title) => {
                    // console.log(title + " created.");
                    createInventory(username, title);
                }).catch((message) => {
                    // console.log(message);
                }).finally(()=> {
                    document.location.reload();
                });
            });
        }
    });
    $('#menu #user #profile').on('click', function () {
        document.location.href = '/logout';
    });
    $(window).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#prompter').fadeOut(100);
        }
    });
});
function prompter(question, defaultanswer) {
    return new Promise((resolve, reject) => {
        $('#prompter').empty();
        let input = document.createElement('input');
        $(input).attr('id', 'input');
        $(input).attr('placeholder', question);
        let ok_button = document.createElement('button');
        $(ok_button).attr('id', 'o');
        $(ok_button).text("OK");
        let cancel_button = document.createElement('button');
        $(cancel_button).attr('id', 'c');
        $(cancel_button).text("Cancel");

        $('#prompter').append(input);
        $('#prompter').append(ok_button);

        $('#prompter').append(cancel_button);
        $('#prompter').fadeIn(100);
        $(input).focus();
        $(ok_button).on('click', function () {
            resolve($(input).val());
            $('#prompter').fadeOut(100);
        })
        $(cancel_button).on('click', function () {
            reject('user canceled');
            
            $('#prompter').fadeOut(100);
        });
        $(window).on('keydown', function (e) {
            if (e.key === 'Escape') {
                reject('user canceled');
                
                $('#prompter').fadeOut(100);
            }
        });
    });

}
function createInventory(username, inventoryname) {
    $.post(`user/${username}/storages/add/${inventoryname}`, function (
        data
    ) {
        console.log(data);
        // let name = data.name;
        // let hash = data.hash;
    });
}
function loadInventory(username, name) {
    
    $('#content #inventory').empty();
    $.getJSON(`/user/${username}/storage/${name}`).then(function (storage) {
        let space = storage.space;
        let keys = Object.keys(space);
        let outerD = document.createElement('div');
        for (key in keys) {
            let item = space[keys[key]];
            let keys2 = Object.keys(item);

            let d = document.createElement('div');
            d.className = 'item';
            let x = document.createElement('span');
            x.className = 'name';
            $(x).text(keys2[0]);
            let y = document.createElement('span');
            y.className = 'amount';
            $(y).text(keys2.length);
            $(d).append(x);
            $(d).append(y);
            $(outerD).append(d);
        }
        $('#content #inventory').append(outerD);
    });
}
