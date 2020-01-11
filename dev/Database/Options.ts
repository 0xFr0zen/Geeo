namespace Options {
    export interface UserCreateOptions {
        firstname: string;
        lastname: string;
        email: string;
        created: Date;
    }
    export interface IDatabase {
        username: string;
        password: string;
    }
}
export default Options;
