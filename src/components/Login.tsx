import React, { useState } from 'react';
import API from '../api/FakeApi';
import { Link } from 'react-router-dom';


function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    return (
        <div className="userlogin">
            <form className="LoginForm">
                {error && <p>{error}</p>}
               
                    <input
                        type="text"
                        placeholder="Benutzername"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        required /><br>
                        </br>
           
                    <input
                        type="password"
                        placeholder="Passwort"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        required /><br></br>
               
                <br />
               
                    <button
                        type="submit"
                        onClick={() => API.post("api/v1/apikey/", { name: username, password: password })}>Login</button><br></br>
               
                    <Link to={`/registration/`} >Noch nicht eingeloggt? Dann hier registrieren.</Link>
            </form>

        </div>


    );
}
export default Login;

