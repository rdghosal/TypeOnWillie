import React, { FormEvent, useContext, Fragment, useState, useEffect } from 'react'
import queryString from "query-string";
import { RouteComponentProps } from 'react-router';
import { AppContext } from './App';
import Navbar from './Navbar';
import { TokenHandler, UserCredentials } from './AuthUtils';


const Login = (props : RouteComponentProps) => {

    const { user, setUser, token, setToken } = useContext(AppContext);
    const [ newUser, toggleUserStatus ] = useState<boolean>(false);

    useEffect(() => {
        const params = queryString.parse(props.location.search);
        if (params["newUser"] == "1") return toggleUserStatus(true);
    }, []);

    const handleSubmit = async (e : FormEvent<HTMLFormElement>) => { 
        e.preventDefault(); // Prevent submision

        let isValid = false;
        const form = document.getElementById("login") as HTMLFormElement;
        const formData = new FormData(form);
        
        const username = formData.get("username");
        const password = formData.get("password");

        if (!username || !password) {
            alert("Must submit both username and password to login");
            return false;
        }

        // Save token and username/id to memory
        const token = await TokenHandler.getToken({ username, password } as UserCredentials);
        setToken(token);

        const userData = TokenHandler.parseClaims(token);
        setUser(userData);

        // Enter application
        return props.history.push("/app");
    }

    const handleGuest = () =>  {
        // Set user as guest
        const guest = {
            id: "guest"
        };
        // sessionStorage.setItem("user", JSON.stringify(guest));
        setUser(guest);
        props.history.push("/app");
    }
    
    return (
        <Fragment>
            <Navbar />
            <div className="login container">
                { 
                    newUser 
                        ? <div className="login__new-user-msg">Let's login to your new account!</div> 
                        : null 
                }
                <h2 className="form__title">Login</h2>
                <form onSubmit={ handleSubmit } id="login">
                    <div className="form-group">
                        <label htmlFor="username">Your username</label>
                        <input type="text" className="form-control" placeholder="Username" name="username" id="username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Your password</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Password"/>
                    </div>
                    <button className="btn btn-primary" type="submit">Login</button>
                    <button className="btn btn-secondary" type="button"
                        onClick={() => props.history.push("/register") }>Sign Up</button>
                    <button className="btn btn-warning" type="button" onClick={ handleGuest }>Continue as Guest</button>
                </form>
            </div>
        </Fragment>
    );
}

export default Login;
