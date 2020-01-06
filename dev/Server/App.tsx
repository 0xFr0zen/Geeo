import React, { Component } from 'react';
export interface Properties {
    compiler: string;
    framework: string;
}
export default class App extends Component<Properties, {}> {

    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}
