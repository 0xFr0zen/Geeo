import React, { Component } from 'react';
import Navigation from '../components/Navigation';
/**
 *
 *
 * @export
 * @class App
 * @extends {Component}
 */
export default class Login extends Component {
    render() {
        return (
            <div id="login">
                <form id="form" method="POST" action="/login" name="loginform">
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                    />
                    <input type="submit" value="Login" />
                    <input type="button" value="Sign Up" id="signup" />
                </form>
            </div>
        );
    }
}
