let resources = ['themes', 'scripts'];
let prms = [];
resources.forEach(v => {
    prms.push(Ping(`localhost/${v}`));
});

Promise.all(prms)
    .then(status => {
        console.log(status);
    })
    .catch(rej => {
        console.error(rej);
    })
    .finally(_of => {
        console.log(_of);
    });
console.log(prms);
function Ping(ip) {
    return new Promise((resolve, reject) => {
        if (!this.inUse) {
            this.status = 'unchecked';
            this.inUse = true;
            this.ip = ip;
            var _that = this;
            this.img = new Image();
            this.img.onload = function() {
                _that.inUse = false;
                resolve('responded');
            };
            this.img.onerror = function(e) {
                if (_that.inUse) {
                    _that.inUse = false;
                    resolve('responded', e);
                }
            };
            this.start = new Date().getTime();
            this.img.src = 'http://' + ip;
            this.timer = setTimeout(function() {
                if (_that.inUse) {
                    _that.inUse = false;
                    reject('timeout');
                }
            }, 1500);
        }
    });
}
