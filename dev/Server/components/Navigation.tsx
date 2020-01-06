import React, { Component } from 'react';
interface IUser {
    name: string;
    id: string;
    inventories: string[];
}
export default class App extends Component<IUser> {
    render() {
        let name = this.props.name;
        let inventories: string[] = this.props.inventories;
        return (
            <div id="menu">
                <div id="inventories">
                    {this.invs(inventories)}
                </div>
            </div>
        );
    }
    invs(invs:string[]){
        let s:any[] = [];
        invs.forEach(inv => {
            s.push(<div className="inventory">
                <div className="name">{inv}</div>
            </div>);
        })
        return s;
    }
}
