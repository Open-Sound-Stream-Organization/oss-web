import React, { useState } from 'react';
import API from '../api/Api';
import { Link } from 'react-router-dom';

//base64 kodierter String, der username und password enthält. wird an Server geschickt
function base64(string: string) {
    return new Buffer(string).toString('base64');
}

//Login-Formular. On Submit werden die Nutzerdaten als base64 über die API übergeben
const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <div className='user-login'>
            <form onSubmit={e => {
                e.preventDefault()
                API.login(base64(`${username}:${password}`))
                    .catch(e => setError(e.message))
            }}>

                <h1>Login</h1>

                {error && <p className='error'>{error}</p>}

                <div>
                    <label htmlFor='username'>Username</label>
                    <input
                        id='username'
                        type='text'
                        placeholder='Username'
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        required
                    />
                </div>

                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        id='password'
                        type='password'
                        placeholder='Password'
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>

                <button type='submit'>Login</button>

                <Link to={`https://oss.anjomro.de/register/`} >Register</Link>

            </form>

        </div>


    );
}
export default Login;

