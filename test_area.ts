import Node from './dev/Crypt/index';
import encryptText from './dev/Crypt/encrypt';
let a: string[] = '1234567890abcdef'.split('');

function rS(ar: string[], hash_length: number) {
    let result = '';
    let length = ar.length;

    for (let i = 0; i < hash_length; i++) {
        let r = Math.floor(Math.random() * (length - 1));
        let letter = ar[r];
        result = result.concat(letter);
    }
    return result;
}
let hashes:string[] = [];
let stoploop:boolean = false;
let max:number = 1024*8;
for (let index = 1; index <=  max && !stoploop; index++) {
    
    let x = rS(a, 64);
    let y = Buffer.from(rS(a, 16),'utf8')
    let z = Buffer.from(rS(a, 16),'utf8')
    let n = encryptText(x,y,z);

    if(!hashes.includes(x)) {
        hashes.push(x);
    }else {
        stoploop= true;
        console.log("LOOOOL hash already in array");
        
    }
    console.log(x,n);
}
console.log(hashes.length == max);
