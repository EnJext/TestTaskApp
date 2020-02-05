import React from 'react';

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleLoginChange(event) {
        this.props.setEmail(event.target.value);
    }

    handlePasswordChange(event) {
        this.props.setPassword(event.target.value);
    }

    async handleSubmit(event){
        await this.props.onSubmit(event);
    }

    handleOnClick(e) {
        this.props.setIsAuthorized(false, null);
    }
    render() {

        if (!this.props.isAuthorized) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email: <input type="text" value={this.props.email} onChange={this.handleLoginChange} />
                    </label>
                    <label>
                        Password: <input type="password" value={this.props.password} onChange={this.handlePasswordChange} />
                    </label>
                    <input type="submit" value="Log in" />
                </form>
            );
        } else {
            return (<div><h4>You're already authorized </h4><button onClick={this.handleOnClick}>Log out</button></div>);
        }
    }
}