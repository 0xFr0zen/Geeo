import Entity from '../Entity';
export default class Database extends Entity {
    private static MYSQL_PORT: number = 1337;
    constructor() {
        super('database', 'db');
        this.addParameter('port', Database.MYSQL_PORT);
        this.addParameter('pwd', 'pass1234567');
        this.addParameter('username', ''); //get from Randomized Database user.
    }
}
class DatabaseUser extends Entity{
    constructor(){
        super('dbuser', '');
        this.addParameter('username',"");
        this.addParameter('password',"");
    }
}