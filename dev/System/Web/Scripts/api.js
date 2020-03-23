$(document).ready(function() {
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
});
