import React, { useState } from 'react';
import API from '../api/Api';
import { Link } from 'react-router-dom';


const Registration = () => {

    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);

    return (
        <div className="userregistration">
            <form className="RegistrationForm">

                <h1>OSS - Registrierung</h1>
                {error && <p>{error}</p>}

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
                    onChange={e => setPassword1(e.target.value)}
                    value={password1}
                    required /><br></br>
                <br />
                <p>Passwort wiederholen</p>
                <input
                    type="password"
                    placeholder="Passwort"
                    onChange={e => setPassword2(e.target.value)}
                    value={password2}
                    required /><br></br>
                <br />

                <button
                    type="submit"
                    onClick={() => API.post("api/v1/apikey/", { username, password1 })}>Registrieren</button>

            </form>

        </div>


    );
}
export default Registration;

