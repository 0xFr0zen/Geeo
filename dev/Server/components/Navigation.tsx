import React, { Component } from 'react';
interface IUser {
    name:string;
    id:string;
}
export default class App extends Component<IUser> {

    render() {
        let name = this.props.name;
        console.log(name);
        return <div id="menu">{name}</div>;
    }
}
