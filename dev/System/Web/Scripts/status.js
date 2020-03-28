let resources = ['themes', 'scripts'];
let prms = [];
resources.forEach(v => {
    let url = `http://localhost/${v}`;
    prms.push(new PingBox(url));
});
function PingBox(url) {
    let that = this;
    Ping(url)
        .then(s => {
            that.status = s;
            this.url = url;
        })
        .catch(e => {
            that.status = 'error';
        })
        .finally(f => {
            if (!this.status) {
                this.error = `Resource '${url}' not responding.`;
            } else {
                if (this.status == 'error') {
                    this.error = `Resource '${url}' not responding.`;
                }
            }
        });
}
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
