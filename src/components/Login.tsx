import React, { useState } from 'react';
import API from '../api/Api';
import { Link } from 'react-router-dom';


function base64(string: string){
    return new Buffer(string).toString('base64');
}

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    var user ={name: username, password: password}

    return (
        <div className="userlogin">
            <form className="LoginForm" 
            onSubmit={e=>{
                e.preventDefault() 
                API.login(base64(`${username}:${password}`))
                setSubmitted(true)}}>
                <h1>OSS - Login</h1>
               

                <p></p>
                <p></p>
                <p>Benutzername</p>
                <input
                    type="text"
                    placeholder="Benutzername"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    required /><br>
                </br>
                <p>Passwort</p>
                <input
                    type="password"
                    placeholder="Passwort"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required /><br></br>

                <br />

                <button
                    type="submit" disabled={loading}
                    >Login</button><br></br><br></br><br></br>
               {loading && <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                {error && <p>{error}</p>}
                 <div className="linkBox">
                    <Link to={`/registration/`} >Registrieren</Link>
                </div>
              
            </form>

        </div>


    );
}
export default Login;

