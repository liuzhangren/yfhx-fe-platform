import React, { Component } from 'react';

import Login from '../../components/Login';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    onSubmit(value) {
        this.setState({ loading: true })
        setTimeout(() => {
            this.setState({ loading: false })
            alert(JSON.stringify(value))
        }, 500);

    }
    render() {
        return (
            <div style={{ width: "560px", margin: "0 auto" }}>
                < Login loading={this.state.loading} onSubmit={
                    this
                        .onSubmit
                        .bind(this)
                } />
            </div>
        )
    }
}
