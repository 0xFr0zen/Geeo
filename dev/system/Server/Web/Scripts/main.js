$(document).ready(function () {
    getInventories();
    $('#menu #optionals .circle#add').on('click', () => {
        prompter('Storage name?', 'newStorage').then((invname) => {
            console.log(invnamename + " created.");
            // createInventory(username, invname);
        }).catch((message) => {
            console.log(message);
        }).finally(() => {
            // document.location.reload();
        });
    });
    $('#menu #inventories .inventory').on('click', function () {
        console.log(this);

    });
    $('#menu #user #profile').on('click', () => {
        document.location.href = '/logout';
    });
    $('#switcher').on('click', () => {
        let laststate = $('#switcher').attr('state');
        if (laststate === 'cashier') {
            $('#switcher').attr('state', 'overview');
        } else {
            $('#switcher').attr('state', 'cashier');
        }
    });
    $(window).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#prompter').fadeOut(100);
        }
    });
});
function prompter(question, defaultanswer) {
    return new Promise((resolve, reject) => {
        let outside = $("#prompter");
        let inputter = outside.find("input");
        inputter.val("");
        inputter.attr('placeholder', question);
        outside.fadeIn('fast');
        inputter.focus();
        inputter.on('keydown', (e) => {
            if (e.originalEvent.key === "Enter") {
                resolve(inputter.val());
                outside.fadeOut('fast');
            }
        });
        $("#prompter button").on('click', (element) => {
            outside.fadeOut('fast');
            let me = $(element.currentTarget);
            switch (me.attr("id")) {
                case 'ok':
                    resolve(inputter.val());
                    break;
                case 'cancel':
                    reject('user rejected');
                    break;
                default:
                    resolve(defaultanswer);
                    break;
            }
        });
    });

}
function getInventories() {
    $("#optionals #loading").fadeIn();
    let url = `/user/${username}/storages`;
    console.log('url', url);

    $.get(url, (data) => {
        console.log(data);
        if (data.length == 0) {
            $("#optionals #add").addClass("highlighted2");
        }

    }).fail((e, textStatus, errorThrown) => {
        console.log(errorThrown);


    }).done((...args) => {
        console.log('args', args);

    });
    $("#optionals #loading").fadeOut();

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
    $("#optionals #loading").fadeIn('fast');
    $('#content #inventory').empty();
    $.getJSON(`/user/${username}/storage/${name}`).then(function (storage) {
        let space = storage.space;
        let keys = Object.keys(space);
        let outerD = document.createElement('div');
        for (key in keys) {
            let item = space[keys[key]];
            let keys2 = Object.keys(item);

            let div = document.createElement('div');
            div.className = 'item';
            let x = document.createElement('span');
            x.className = 'name';
            $(x).text(keys2[0]);
            let span = document.createElement('span');
            span.className = 'amount';
            $(span).text(keys2.length);
            $(div).append(x);
            $(div).append(span);
            $(outerD).append(div);
        }
        $('#content #inventory').append(outerD);
    }).done(() => {
        console.log("fading out..");
        $("#optionals #loading").fadeOut('fast');
    });

}
