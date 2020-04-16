import React, { useState } from 'react';
import API from '../api/FakeApi';
import { Z_STREAM_ERROR } from 'zlib';
import { Link } from 'react-router-dom';



function Registration() {

    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    // const [error, setError] = useState(null);

    // API.catch(e => setError(error));
   
    // return (
    //     <div className="userlogin">
    //         <form name="LoginForm">
    //             {error && <p>{error}</p>}
    //             <label>
    //                 <input
    //                     type="text"
    //                     placeholder="Benutzername"
    //                     onChange={e => setUsername(e.target.value)}
    //                     value={username}
    //                     required />
    //             </label>
    //             <label>
    //                 <input
    //                     type="password"
    //                     placeholder="Passwort"
    //                     onChange={e=> setPassword(e.target.value)}
    //                     value={password}
    //                     required />
    //             </label>
    //             <br />
    //             <label>
    //                 <button
    //                     type="submit"
    //                     onClick={() => API.post("api/v1/apikey/", { name: username, password: password })}>Login</button>
    //             </label>
    //             <label>
    //                 <Link to = {`/registration/`} >Noch nicht eingeloggt? Dann registrieren.</Link>
                
    //             </label>
    //         </form>
           
    //     </div>


    // );
}
export default Registration; 

