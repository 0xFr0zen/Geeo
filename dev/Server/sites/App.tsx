import React, { Component } from 'react';
import Navigation from '../components/Navigation';
export default class App extends Component {
    render() {
        let username = "lala";
        let id= "";
        let inventories = ["default"];
        return (
            <div id="main_inner">
                <Navigation name={username} id={id} inventories={inventories}></Navigation>
            </div>
        );
    }
}
