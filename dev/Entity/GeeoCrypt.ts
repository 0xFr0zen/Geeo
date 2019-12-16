import * as crypto from 'crypto';
namespace GeeoCrypt {
    export class Node {
        private value: string = null;
        // private static salt = Math.random().toString();

        constructor() {
            let current_date: string = new Date().valueOf().toString();
            let random: string = Math.random().toString();
            this.value = crypto
                .createHash('sha256')
                .update(current_date + random)
                .digest('hex').toString();
        }
        public toString():string{
            return this.value.toString();
        }
        public inspect():string{
            return this.toString();
        }
    }
}
export default GeeoCrypt;
