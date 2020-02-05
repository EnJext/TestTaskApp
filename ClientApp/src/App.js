import React from 'react';
import './App.css';
import { LoginForm } from './LoginForm'
import {InfoPage} from './Info'
import {
    Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

import { createBrowserHistory } from 'history';
let history = createBrowserHistory();

export class App extends React.Component
{
    constructor(props) {
        super(props);

        let isAuth = sessionStorage.getItem('isAuthorized');

        this.state = {
            email: '',
            password: '',
            isAuthorized: (isAuth === null ? false : JSON.parse(isAuth)),
            currentUser: {
                name: ''
            }
        };

        this.setPasswrod = this.setPasswrod.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.setIsAuthorized = this.setIsAuthorized.bind(this);
    }

    render() {
        return(
            <Router history={history}>
                <Switch>
                    <Route exact path = '/Login'>
                        <LoginForm onSubmit={this.handleSubmit} email={this.state.email}
                            password={this.state.password} setPassword={this.setPasswrod}
                            setEmail={this.setEmail} isAuthorized={this.state.isAuthorized}
                            setIsAuthorized={this.setIsAuthorized}/> 
                    </Route>
                    <Route exact path = '/Info'>
                        <InfoPage currentUser={this.state.currentUser} setUserData={this.setUserData}
                            history={history} setIsAuthorized={this.setIsAuthorized}
                            isAuthorized={this.state.isAuthorized}/>
                    </Route>
                        <Redirect exact from='/' to='Login' />
               </Switch>
            </Router>
        );
    }

    setIsAuthorized(isAuthorized, token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('isAuthorized', isAuthorized);
        this.setState({ isAuthorized: isAuthorized });
    }

    setPasswrod(password){
       this.setState({password: password});
    }

    setEmail(email){
        this.setState({ email: email });
    }

    setUserData(user) {
        this.setState({ currentUser: user})
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.email !== '' && this.state.password !== '') {
            let user = {
                email: this.state.email,
                password: this.state.password
            };

            let token = await authenticateUser(user)

            if (token !== undefined) {
                this.setIsAuthorized(true, token);
                history.push('/Info');
            }
        }
        else {
            alert('Enter login and password');
        }
    }
}

async function authenticateUser(user) {
    let response = await fetch("api/Account", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    let result = await response.json();

    if (response.ok === true) {
        return result.access_token.result;
    }
    else {
        alert(result.errorText);
    }
}
