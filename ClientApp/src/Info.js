import React from 'react'
import { Link } from 'react-router-dom'


export class InfoPage extends React.Component{

    render() {
        if (this.props.isAuthorized) {
            let name = this.props.currentUser.name;
            let token = sessionStorage.getItem('token');
            return (
                <div>
                    <h2>Info Page</h2>
                    <span style={{ wordWrap: 'break-word', display: 'inline-block', width: '600px' }}>
                        Token: {token}</span>
                    <p>Name: {name}</p>
                </div>
            );
        }else{
            return (<h5> You're not authorized : <Link to='/Login'>Log in</Link></h5>);
        }

    }

    async componentDidMount() {
        if (this.props.isAuthorized) {

            let token = sessionStorage.getItem('token');

            let result = await getUserInfo(token);

            if (result === 401) {
                this.props.setIsAuthorized(false, null);
            }
            else {
                this.props.setUserData(result);
            }
        }
    }
} 

 
async function getUserInfo(token){
    
    const response = await fetch("api/Account", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token  
        }
    });

    if (response.ok === true) {
        const data = await response.json();
        return data
    } else if (response.status === 401) {
        return response.status;
    }
    return null;
}