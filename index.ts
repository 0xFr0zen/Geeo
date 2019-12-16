import User from './dev/User';
import Safe from './dev/Safe';

let user = new User('oezguerisbert');
let ks: Safe = new Safe('ks')
    .addItem('products', ['Coca Cola', 'Fanta', 'Smirnoff'])
    .removeItem('products');
user.addSafe(ks);
user.getSafe('documents').addItem('loans', [990.00]);
user.save();