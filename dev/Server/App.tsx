import React, { Component } from 'react';
import Navigation from './components/Navigation';
import User from '../system/Entity/User';
import Identity from '../system/Identity';
export default class App extends Component {
    render() {
        let i = Identity.of('admin');
        let user: User = User.from(i);
        return (
            <div id="main_inner">
                <Navigation name={user.getName()} id={i.getUsername()}></Navigation>
            </div>
        );
    }
}
