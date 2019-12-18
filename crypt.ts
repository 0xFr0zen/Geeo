import Node from './dev/Crypt';

let profile = {
    user:"root",
    pass:"root"
};
let file = JSON.stringify(profile);

let encrypted = new Node(file).toString();
let encrypted_obj = JSON.parse(encrypted);

let s = new Node(encrypted_obj.data, {key:encrypted_obj.key,iv:encrypted_obj.iv}).toString();

console.log('s', JSON.parse(JSON.parse(s).data));
