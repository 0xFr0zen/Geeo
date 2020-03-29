window.IntervalSequence = ['themes', 'scripts', 'images'];

$(document).ready(() => {
    window.p = new Ping();
    if (window.PingInterval) clearInterval(window.PingInterval);
    window.IntervallHolder = [];
    window.PingInterval = setInterval(() => {
        window.IntervallHolder = [];
        window.IntervalSequence.forEach(seq => {
            window.p.ping(`http://localhost/${seq}`, function(err, data) {
                window.IntervallHolder.push({ url: seq, time: data });
            });
        });
        console.log(window.IntervallHolder);
    }, 10000);
});
