$(document).ready(function () {
    loadInventory("friends");
    $("#menu #inventories .inventory").each((index, ínventory_button) => {
        $(ínventory_button).on('click', function (e) {
            var name = $(this).children(".name").attr('invname');
            console.log(name);

            loadInventory(name);
        });
    });
    $("#menu #user #profile").on('click', function () {
        document.location.href = "/logout";
    })
});

function loadInventory(name) {
    $.getJSON("/user/admin/storages").then(function (storages) {
        storages = storages.filter((storage) => {
            return storage.name === name;
        });
        if (storages.length > 0) {
            let storage = storages[0];
            let space = storage.space;
            let keys = Object.keys(space);
            let outerD = document.createElement('div');
            for (key in keys) {
                let item = space[keys[key]];
                let keys2 = Object.keys(item);

                let d = document.createElement('div');
                d.className = "item";

                let x = document.createElement('span');
                x.className = "name";
                $(x).text(keys2[0]);

                let y = document.createElement('span');
                y.className = "amount";
                $(y).text(keys2.length);
                $(d).append(x);
                $(d).append(y);
                $(outerD).append(d);
            }
            $("#content #inventory").empty();

            $("#content #inventory").append(outerD);
        }


    });
}