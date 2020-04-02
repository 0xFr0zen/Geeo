window.ResourceLoaderPackage = [];
$(document).ready(async function() {
    PageLoader().then(b => {
        $('#loader').toggleClass('hidden');
        $('#main').toggleClass('hidden');
        setTimeout(() => {
            $('#loader').css('display', 'none');
        }, 500);
    });
});
function PageLoader() {
    return Promise.all(prepareResourceLoader());
}
function ResourceLoader(fn) {
    return new Promise((resolve, reject) => {
        resolve(fn());
    });
}
function prepareResourceLoader() {
    window.ResourceLoaderPackage.push(
        ResourceLoader(() => {
            $('#main').css('opacity', '1');
            $('#menu #mode').on('click', e => {
                let modes = {
                    dark: { goto: 'light', text: 'brightness_2' },
                    light: { goto: 'dark', text: 'wb_sunny' },
                };
                let elem = $(e.target);
                var currentState = elem.attr('state');
                elem.attr('state', modes[currentState].goto);

                if (window.localStorage) {
                    localStorage.setItem(
                        'brightnessmode',
                        modes[currentState].goto
                    );
                }
                elem.text(modes[currentState].text);
                document.body.toggleAttribute('dark');
            });
            $('#switcher').on('click', () => {
                let laststate = $('#switcher').attr('state');
                if (laststate === 'cashier') {
                    $('#switcher').attr('state', 'overview');
                } else {
                    $('#switcher').attr('state', 'cashier');
                }
            });
            return true;
        })
    );
    window.ResourceLoaderPackage.push(
        ResourceLoader(() => {
            if (window.localStorage) {
                let br_mode = localStorage.getItem('brightnessmode');
                if (typeof br_mode === 'undefined' || br_mode == null) {
                    br_mode = 'light';
                    localStorage.setItem('brightnessmode', br_mode);
                }
                $('#menu #mode').attr('state', br_mode);
                let modes = {
                    dark: { goto: 'light', text: 'wb_sunny' },
                    light: { goto: 'dark', text: 'brightness_2' },
                };
                $('#menu #mode').text(modes[br_mode].text);

                if (br_mode === 'dark') {
                    document.body.setAttribute('dark', '');
                } else {
                    document.body.removeAttribute('dark');
                }
            }
            return true;
        })
    );
    return window.ResourceLoaderPackage;
}
