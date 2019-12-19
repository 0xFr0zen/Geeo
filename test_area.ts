let a: string[] = '1234567890abcef'.split('');

function rS(ar: string[]) {
    let result = '';
    let length = ar.length;

    for (let i = 0; i < 16; i++) {
        let r = Math.floor(Math.random() * (length - 1));
        let letter = ar[r];
        result = result.concat(letter);
    }
    return result;
}
let x = rS(a);
let y = Buffer.from(x, 'utf8').toString('hex');

let f = [];
for (let index = 0; index < y.length; index = index + 8) {
    f.push(Number.parseInt(y.slice(index, index + 8)));
    
}
console.log(f);